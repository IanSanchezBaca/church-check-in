/********************************************
 * This is a wrapper for the eagle kids layout.js
 * This will preload the databases so that i can do some checks
 *  - check if the kid exists in the parent database
 *  - preload the attendance database
*********************************************/
'use client';

// import { initializeApp } from 'firebase/app'; // prob dont need this
import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '@/app/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, onSnapshot } from 'firebase/firestore';


// 1. Create the Context object
// This is what components will 'useContext' to access the provided values.
export const EagleKidsPreloadContext = createContext(null);

// 2. create the provider component
export const EagleKidsPreloadProvider = ({ children }) => {
    /* --- Firebase Core States --- */
    // const [isAuthReady, setIsAuthReady] = useState(false); // Flag indicating if Firebase Auth is initialized and user status known

    /* variables for the user */
    const [isAdmin, setIsAdmin] = useState(false);
    const [userData, setUserData] = useState(null);// Current auth user data

    /* variables used for the date and for preloading */
    const [currDate, setDate] = useState(null);
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [hour, setHour] = useState('');
    const [min, setMin] = useState('');

    /* attendance database variables */
    const [AttendanceDB, setAttendanceDB] = useState(null);
    // this will hold the attendance database
    const [attendanceIsLoading, setAttendanceIsLoading] = useState(true);
    // this is the loading for the attendance

    /* parents database variables */
    const [parentsDB, setParentsDB] = useState([]);
    // the parents db
    const [parentsDBIsLoading, setParentsDBIsLoading] = useState([]);
    // checks if the parents database is loading 


    useEffect(() => { // used to check if the user exists and is an admin
        if (!auth) {
            alert("Something went wrong check the console. (auth)");
            console.warn("Firebase auth instance is not available. Something went wrong with the auth thing.");
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) { // this will be used later for other stuff
                console.log("EagleKidsPreload: user found fetching data")
                const usersRef = doc(db, 'users', user.uid)
                const userDoc = await getDoc(usersRef);

                if (userDoc.exists()) {
                    const userDat = userDoc.data();
                    setUserData(userDat);

                    // console.log(`EagleKidsPreload: ${userDat.isAdmin}`);

                    if (userDat.isAdmin === true) {
                        setIsAdmin(true);
                    }
                }
            }
            else {
                console.log("EagleKidsPreload: user not found")
            }



        }); // unsubscribe



        return () => unsubscribe();

    }, [/*auth*/]);// useEffect: this resets when auth changes

    useEffect(() => { // get date and time, used for attendance database
        const today = new Date(); // current date
        setDate(today);
        setYear(today.getFullYear()); // sets the year variable
        setMonth(String(today.getMonth() + 1).padStart(2, '0')); // set the month variable
        setDay(String(today.getDate()).padStart(2, '0'));// get the day of the month (1-31)
        setHour(today.getHours());
        /* get the mins not really needed just cool to have*/
        setMin(today.getMinutes());
    }, []); // useEffect: date time management


    useEffect(() => { // preload attendance database for current day
        if (month && year) {
            setAttendanceIsLoading(true); // attendence is loading now

            const preloadAttendanceDB = async () => {
                const monthYear = `${month}-${year}`;

                /** get the reference to the current date's doc **/
                const attendanceCollectionRef = collection(db, "attendance"); // this is a reference to the collection not the actuall collection

                const attendanceDocRef = doc(attendanceCollectionRef, monthYear); // reference to doc in collection

                try {
                    /* attempt to get the doc for the currenct monthYear */
                    console.log(`EagleKidsPreload: Attempting to preload attendance for ${monthYear}...`);
                    const docSnap = await getDoc(attendanceDocRef);
                    // this is the actuall doc

                    if (docSnap.exists()) {
                        setAttendanceDB(docSnap.data());
                        console.log(`EagleKidsPreload: Preloaded data for ${monthYear}.`);
                    }
                    else {
                        /* if it doesn't exists create an emtpy map
                        * This signals its ready to be created
                       **/
                        setAttendanceDB({});
                        console.log(`EagleKidsPreload: No existing data for ${monthYear}, ready to create.`);
                    }
                }// try
                catch (e) {
                    alert("sorry something went wrong.")
                    setAttendanceDB(null);
                    console.error("Error preloading month attendance:", e);
                }// catch
                finally {
                    setAttendanceIsLoading(false);
                }// finally
            } // preloadAttendanceDB
            preloadAttendanceDB();
        }
    }, [month, year]); // useEffect: preload attendance database for current day

    useEffect(() => { // preload parent database
        setParentsDBIsLoading(true);

        const preloadParentsDB = async () => {
            const parentsCollectionRef = collection(db, "parents");

            try {
                const q = query(parentsCollectionRef);
                const parents = [];

                onSnapshot(q, (querySnapshot) => {
                    // this makes it so that admins no longer need to reload
                    querySnapshot.forEach((doc) => {
                        parents.push({
                            id: doc.id,
                            ...doc.data(),
                        });
                    });

                });

                setParentsDB(parents);

                console.log("EagleKidsPreload: ParentsDB loaded")
            }
            catch (e) {
                console.error("preload parents error: ", e);
                setParentsDB(null);
            }
            finally {
                setParentsDBIsLoading(false);
            }
        } // preloadParentsDB

        preloadParentsDB();

    }, []);

    const contextValue = {
        isAdmin,
        userData,
        day, month, year, hour, min, currDate,
        AttendanceDB,
        attendanceIsLoading,
        parentsDB,
        parentsDBIsLoading,
        updatePreloadedAttendance: (updatedData) => setAttendanceDB(updatedData),
    };

    return (
        <EagleKidsPreloadContext.Provider value={contextValue}>
            {children}
        </EagleKidsPreloadContext.Provider>
    );


} // export const EagleKidsPreloadProvider