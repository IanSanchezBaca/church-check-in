```js
// src/context/FirebaseAttendanceContext.js
'use client'; // This component must be a Client Component to use useState/useEffect

import React, { createContext, useState, useEffect } from 'react';
// IMPORTING ALREADY INITIALIZED FIREBASE AUTH AND FIRESTORE INSTANCES
import { auth as firebaseAuthInstance, db as firestoreDbInstance, appId as firebaseAppId } from '@/app/lib/firebase'; // Assuming appId is also exported

import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'; // Specific auth functions
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'; // Specific firestore functions

// Use the appId imported from your central firebase file
const appId = firebaseAppId || (typeof __app_id !== 'undefined' ? __app_id : 'default-app-id');

// 1. Create the Context object
export const FirebaseAttendanceContext = createContext(null);

// 2. Create the Provider Component
export const FirebaseAttendanceProvider = ({ children }) => {
    // --- Firebase Core States (now directly assigned from imported instances) ---
    // We are no longer initializing Firebase here; we're using the already initialized
    // instances exported from '@/app/lib/firebase'.
    const db = firestoreDbInstance;
    const auth = firebaseAuthInstance;

    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    // --- Date/Time States ---
    const [currentDate, setCurrentDate] = useState(null);
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    // --- Preloading States for Attendance Data ---
    const [preloadedMonthAttendance, setPreloadedMonthAttendance] = useState(null);
    const [isLoadingAttendancePreload, setIsLoadingAttendancePreload] = useState(true);
    const [attendancePreloadError, setAttendancePreloadError] = useState(null);

    // --- Preloading States for Parents Data ---
    const [preloadedParentsData, setPreloadedParentsData] = useState(null);
    const [isLoadingParentsPreload, setIsLoadingParentsPreload] = useState(true);
    const [parentsPreloadError, setParentsPreloadError] = useState(null);

    // --- useEffect: Firebase Authentication Listener ---
    useEffect(() => {
        // Ensure the Firebase Auth instance is available before setting up the listener.
        if (!auth) {
            console.warn("Firebase Auth instance is not available. Check your '@/app/lib/firebase' setup.");
            setAttendancePreloadError("Firebase Auth not initialized.");
            setParentsPreloadError("Firebase Auth not initialized.");
            setIsAuthReady(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in.
                setUserId(user.uid);
                setIsAuthReady(true);
            } else {
                // User is signed out. For this public check-in app, we sign in anonymously
                // if there isn't already an anonymous user logged in.
                try {
                    if (!auth.currentUser) { // Check if there's no user at all
                         await signInAnonymously(auth);
                         console.log("Signed in anonymously for public access.");
                    } else if (!auth.currentUser.isAnonymous) {
                         // This path would be if a non-anonymous user logs out, and we need to revert to anonymous.
                         // For this app, parents aren't logging in, so this might not be hit often.
                         await signInAnonymously(auth);
                         console.log("Reverted to anonymous sign-in after non-anonymous logout.");
                    }
                } catch (err) {
                    console.error("Firebase Auth Error during anonymous sign-in:", err);
                    setAttendancePreloadError("Failed to authenticate Firebase for attendance.");
                    setParentsPreloadError("Failed to authenticate Firebase for parents data.");
                } finally {
                    setIsAuthReady(true); // Auth state is now known
                }
            }
        });

        // Cleanup subscription on component unmount
        return () => unsubscribe();
    }, [auth]); // Dependency on 'auth' instance.

    // --- useEffect: Date/Time Management ---
    useEffect(() => {
        const now = new Date();
        setCurrentDate(now);
        setDay(String(now.getDate()));
        setMonth(String(now.getMonth() + 1).padStart(2, '0'));
        setYear(String(now.getFullYear()));
    }, []);

    // --- useEffect: Preloading Current Month's Attendance Data ---
    useEffect(() => {
        if (isAuthReady && db && month && year) {
            setIsLoadingAttendancePreload(true);
            setAttendancePreloadError(null);

            const fetchCurrentMonthAttendance = async () => {
                const monthYearDocId = `${month}-${year}`;
                const attendanceCollectionRef = collection(db, `artifacts/${appId}/public/attendance`);
                const attendanceDocRef = doc(attendanceCollectionRef, monthYearDocId);

                try {
                    console.log(`[PRELOAD-ATTENDANCE] Attempting to preload public attendance for document: ${monthYearDocId}`);
                    const docSnap = await getDoc(attendanceDocRef);

                    if (docSnap.exists()) {
                        setPreloadedMonthAttendance(docSnap.data());
                        console.log(`[PRELOAD-ATTENDANCE] Document '${monthYearDocId}' exists. Data:`, docSnap.data());
                    } else {
                        setPreloadedMonthAttendance({});
                        console.log(`[PRELOAD-ATTENDANCE] Document '${monthYearDocId}' does NOT exist. Ready to create.`);
                    }
                } catch (e) {
                    console.error("[PRELOAD-ATTENDANCE ERROR]", e);
                    setPreloadedMonthAttendance(null);
                    setAttendancePreloadError("Failed to preload attendance data.");
                } finally {
                    setIsLoadingAttendancePreload(false);
                }
            };

            fetchCurrentMonthAttendance();
        } else {
            console.log("[PRELOAD-ATTENDANCE] Conditions not met:", {isAuthReady, db: !!db, month, year});
        }
    }, [db, isAuthReady, month, year, appId]); // Added appId to dependencies for consistency

    // --- useEffect: Preloading All Parents Data ---
    useEffect(() => {
        if (isAuthReady && db) {
            setIsLoadingParentsPreload(true);
            setParentsPreloadError(null);

            const fetchParentsData = async () => {
                const parentsCollectionRef = collection(db, `artifacts/${appId}/public/parents`);

                try {
                    console.log("[PRELOAD-PARENTS] Attempting to preload parents data...");
                    const querySnapshot = await getDocs(parentsCollectionRef);
                    const parents = [];
                    querySnapshot.forEach((doc) => {
                        parents.push({ id: doc.id, ...doc.data() });
                    });
                    setPreloadedParentsData(parents);
                    console.log(`[PRELOAD-PARENTS] Preloaded ${parents.length} parent documents.`, parents);
                } catch (e) {
                    console.error("[PRELOAD-PARENTS ERROR]", e);
                    setPreloadedParentsData(null);
                    setParentsPreloadError("Failed to preload parents data.");
                } finally {
                    setIsLoadingParentsPreload(false);
                }
            };

            fetchParentsData();
        } else {
            console.log("[PRELOAD-PARENTS] Conditions not met:", {isAuthReady, db: !!db});
        }
    }, [db, isAuthReady, appId]); // Added appId to dependencies for consistency

    // Context Value Object
    const contextValue = {
        db,
        auth,
        userId,
        isAuthReady,
        currentDate,
        day, month, year,
        preloadedMonthAttendance,
        isLoadingAttendancePreload,
        attendancePreloadError,
        updatePreloadedAttendance: (updatedData) => setPreloadedMonthAttendance(updatedData),
        preloadedParentsData,
        isLoadingParentsPreload,
        parentsPreloadError
    };

    return (
        <FirebaseAttendanceContext.Provider value={contextValue}>
            {children}
        </FirebaseAttendanceContext.Provider>
    );
};
```