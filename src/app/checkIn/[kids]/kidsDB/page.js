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
    const [keyword, setKeyword] = useState("");
    const [results, setResults] = useState([])

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

    const search = async () => {
        /* if the button was pressed and there was no keyword, do nothing */
        if (!keyword) return;

        const querySnapshot = await getDocs(collection(db, "parents"));
        const allParents = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        const lower = keyword.toLowerCase();

        const filtered = allParents.filter((doc) => {

            const parentMatch = doc.firstName?.toLowerCase().includes(lower) || doc.lastName?.toLowerCase().includes(lower);

            const kidMatch = doc.kids?.some((kid) =>
                kid.firstName?.toLowerCase().includes(lower) ||
                kid.lastName?.toLowerCase().includes(lower)
            );


            return parentMatch || kidMatch
        });


        setResults(filtered)
    }; // search

    if (!isAdmin) return null // should not be able to reach here but just in case

    return element('div', { className: 'KidsDBMainDiv' },
        [
            element('h2', { key: "kidbdh2", className: "kiddbh2" }, "Kid DataBase"), // h2

            element('div', {
                key: "inputWrapper",
                className: "KDBinputwrapper",
            },
                [
                    element('input', {
                        key: "kdbinput",
                        className: "kdbinput",
                        placeholder: "Keyword...",
                        type: "text",
                        value: keyword,
                        onChange: (e) => setKeyword(e.target.value),
                    }), // input

                    element('button', {
                        key: "kdbbutton",
                        className: 'kdbbutton',
                        onClick: search,
                    }, "Search") // button
                ]
            ), // inputwrapper

            element('ul', { key: "kdbul", className: 'kdbul' },
                results.map((item) =>
                    element('li', { key: item.id, className: "kdbli" },
                        [
                            `${item.firstName} ${item.lastName}`,
                            element('ul', { key: 'dbkul', className: 'dbkul' },
                                item.kids?.map((kid, index) =>
                                    element('li', { key: index }, `${kid.firstName} ${kid.lastName}`)
                                )
                            )
                        ]
                    )
                )
            ),

        ]

    )// kidsmaindiv

} // KidsDB