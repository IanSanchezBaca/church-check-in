/********************************************
 * kidsDB
 * This will be where the admins can look up the information on the kids
 * will probably recycle this page to do the signin thing
*********************************************/
'use client'

import React, { useEffect, useState } from 'react'
import { auth, db } from '@/app/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { useRouter } from 'next/navigation'

const { createElement: element } = React

export default function KidsDB() {
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();
    /* this stuff is for database checking */
    // const [keyword, setKeyword] = useState("");
    const [results, setResults] = useState([])
    /* this is going to be use to make the searching more advanced */
    const [kidFirstName, setKidFirstName] = useState('')
    const [kidLastName, setKidLastName] = useState('')
    const [kidID, setKidID] = useState('')
    const [parentFirstName, setParentFirstName] = useState('')


    /* this function only checks if the user is an admin */
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            /* if theyre not signed in they shouldnt be able to use this page */
            if (!user) {
                router.push('/')
                return
            }

            const userRef = doc(db, 'users', user.uid)
            const userDoc = await getDoc(userRef)

            if (userDoc.exists()) {
                const userData = userDoc.data()

                if (userData.isAdmin === true) {
                    setIsAdmin(true)
                }

            }
        })
        return () => unsubscribe()
    }, [router]) // admin checker

    /* The search function */
    const search = async () => {
        /* if the button was pressed and there was no keyword, do nothing */
        // if (!keyword) return;

        /* this really worries me as this reads all the parents at one time 
         *** some things to think about, maybe load it for the day then delete it to save memory? */
        const querySnapshot = await getDocs(collection(db, "parents"));
        const parents = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        const kfn = kidFirstName.toLowerCase();
        const kln = kidLastName.toLowerCase();
        const kidId = kidID.toLowerCase();
        const pfn = parentFirstName.toLowerCase();

        const matches = []

        for (const parent of parents) {
            const parentFirst = parent.firstName?.toLowerCase() || "";

            if (!parent.kids) continue; // i guess this skips the iteration if not something

            for (const kid of parent.kids) {
                const matchKidFirst = kfn && kid.firstName?.toLowerCase().includes(kfn);
                const matchKidLast = kln && kid.lastName?.toLowerCase().includes(kln);
                const matchKidID = kidId && kid.id?.toLowerCase().includes(kidId);
                const matchParent = pfn && parentFirst.includes(pfn);

                /* if any field is filled and matches, add this kid to the list */
                const match = (!kfn || matchKidFirst)
                    && (!kln || matchKidLast)
                    && (!kidId || matchKidID)
                    && (!pfn || matchParent);

                if (match) {
                    matches.push({
                        kid,
                        parent
                    });
                }
            }
        }

        setResults(matches)
    }; // search

    if (!isAdmin) return null // should not be able to reach here but just in case

    return element('div', { className: 'KidsDBMainDiv' },
        [
            element('h2', { key: "kidbdh2", className: "kdbh2" }, "DataBase"), // h2

            element('div', {
                key: "inputWrapper",
                className: "KDBinputwrapper",
            },
                [
                    element('input', {
                        key: "kdbfninput",
                        className: "kdbinput kdbfninput",
                        placeholder: "Kid First Name",
                        value: kidFirstName,
                        onChange: (e) => setKidFirstName(e.target.value),
                    }), // input
                    element('input', {
                        key: "kdblninput",
                        className: "kdbinput kdblninput",
                        placeholder: "Kid Last Name",
                        value: kidLastName,
                        onChange: (e) => setKidLastName(e.target.value),
                    }), // input
                    element('input', {
                        key: "kdbidinput",
                        className: "kdbinput kdbidinput",
                        placeholder: "Kid ID",
                        value: kidID,
                        onChange: (e) => setKidID(e.target.value),
                    }), // input
                    element('input', {
                        key: "kdbparentinput",
                        className: "kdbinput kdbparentinput",
                        placeholder: "Parent First Name",
                        value: parentFirstName,
                        onChange: (e) => setParentFirstName(e.target.value),
                    }), // input

                ]
            ), // inputwrapper

            element('div',
                {
                    key: 'searchbuttonwrapper',
                    className: "searchbuttonwrapper"
                },
                [
                    element('button', {
                        key: "kdbbutton",
                        className: 'kdbsearchbutton',
                        onClick: search,
                    }, "Search"), // button
                ]
            ),

            element('div', { key: "kdbcardsdiv", className: 'kdbcardsdiv' },
                results.map((entry, index) =>
                    element('div', { key: index, className: 'kdbcard' }, [
                        element('p',
                            { key: "kdbkidname", className: 'kdbname' },
                            `${entry.kid.firstName} ${entry.kid.lastName}`
                        ), // kid first name
                        element('p',
                            { key: "kdbkidid", className: 'kdbkidid' },
                            `ID: ${entry.kid.id}`,
                        ), // kid id
                        element('p',
                            { key: "kdbkidbd", className: 'kdbkidbd' },
                            `Birth Date: ${entry.kid.birthdate}`,
                        ), // kid birthday
                        element('p',
                            { key: "kdbkidallergies", className: 'kdbkidallergies' },
                            `Allergies: ${entry.kid.allergies || 'None'}`,
                        ), // kid allergies

                        // break
                        element('hr', { key: 'kdbhr', className: "kdbhr" }),

                        /* Parent info */
                        element('p',
                            {
                                key: 'kdbparentname', className: "kdbparentname"
                            },
                            `Parent: ${entry.parent.firstName} ${entry.parent.lastName}`
                        ), // parent name
                        element('p',
                            { key: 'kdbparentcontact', className: "kdbparentcontact" },
                            `Phone Number: ${entry.parent.phone || 'N/A'}`
                        ), // parent phone NUmber
                        element('p',
                            { key: 'kdbparentemergenC', className: "kdbparentemergenC" },
                            `Emergency: ${entry.parent.emergency || 'N/A'}`
                        ), // parent name
                    ]) // div
                )
            ),

        ]

    )// kidsmaindiv

} // KidsDB