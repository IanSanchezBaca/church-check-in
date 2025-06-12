/********************************************
 * adminButton.js
*********************************************/

'use client';
import React, { useEffect, useState } from 'react';
import { auth, db } from '@/app/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import Link from "next/link";

export default function AdminButton() {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false)
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userRef = doc(db, 'users', user.uid)
                const userDoc = await getDoc(userRef)

                if (userDoc.exists()) {
                    const userData = userDoc.data()

                    if (userData.isAdmin === true) {
                        setIsAdmin(true)
                    }
                }
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (!isAdmin) {
        return null
    } // this button should not show up if the user is not an admin


    return React.createElement('div', { className: "adminButton" },
        [
            React.createElement(Link, {
                key: "amdinButtonLink",
                href: '/checkIn/kids/kidsDB',
                className: 'adminButtonLink'
            },
                "Kids Database")
        ]
    ) // return

}// adminButton 