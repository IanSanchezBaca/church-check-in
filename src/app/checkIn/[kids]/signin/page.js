/********************************************
 * Kids sign in page
*********************************************/
'use client'

import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from '@/app/lib/firebase';
import { Bouncy } from 'ldrs/react'
import 'ldrs/react/Bouncy.css'
// Default values shown
<Bouncy
    size="45"
    speed="1.75"
    color="black"
/>

const { createElement: element } = React




export default function SignIn() {
    const [KID, setID] = useState(''); // this is for the kid sign in

    /* variables used for the date and for preloading */
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [hour, setHour] = useState('');
    const [min, setMin] = useState('');

    /* variables used for preloading */
    const [monthAttendance, setMonthAttendance] = useState(null) // this will hold the pre loaded month and stuff
    const [isLoading, setisLoading] = useState(true); // idk i guess makes the user wait to preload the database


    useEffect(() => { // get the date
        /* get the date */
        const today = new Date(); // gives me the current date

        const year = today.getFullYear(); // gives me the year
        setYear(year);

        const month = String(today.getMonth() + 1).padStart(2, '0');
        // Get the month (0-11, add 1 for 1-12)
        setMonth(month);

        const day = String(today.getDate()).padStart(2, '0');
        // get the day of the month (1-31)
        setDay(day);

        /* get hour */
        const hour = today.getHours();
        setHour(hour);

        /* get the mins */
        const min = today.getMinutes();
        setMin(min);

        const preload = async () => {
            setisLoading(true); // just waits until the database loads so that it 
            /* preload the database */
            const monthYear = `${month}-${year}`;

            /** get the reference to the current date's doc **/
            const attendanceCollectionReference = collection(db, monthYear); // this is a reference to the collection not the actuall collection
            const attendanceDocumentReference = doc(attendanceCollectionReference, monthYear); // reference to doc in collection

            try {
                /**  Read: Attempt to get the document for the current month/year **/
                const docSnap = await getDoc(attendanceDocumentReference); // this is the actuall doc

                if (docSnap.exists()) { // if it exists save the data to the variable monthAttendance
                    setMonthAttendance(docSnap.data());
                }
                else {
                    /* if it doesn't exists create an emtpy map
                     * This signals its ready to be created
                    **/
                    setPreloadedMonthAttendance({});
                }

            }// try
            catch (e) {
                alert("sorry something went wrong please reload the page.")
                setPreloadedMonthAttendance(null);
                console.error("Error preloading month attendance:", e);
            }
            finally {
                setisLoading(false);
            }
        }; // preload

        /* run the function to preload the database */
        preload();

        /* if i want this effect to rerun when a variable is changed add that variable inside the [] */
    }, []); // useEffect

    const signin = async (e) => {
        if (!KID) { // make sure the user types something in
            alert("Please type your kid's ID to sign them in.");
            return;
        }
        alert("currently Work In Progress.")
    } // signin





    return element('div', { className: "kidsigninMainDiv" },
        [
            element('h2', { key: "kidsigninH2", className: "kidsigninH2" }, "Sign In Kid"), // heading 2

            element('p',
                {
                    key: "kidsigninDate",
                    className: "kidsigninDate"
                },
                `${month}/${day}/${year} ${hour}:${min}`
            ), // p (date)


            element('div', { key: "kidsignininputWrapper0", className: "kidsignininputWrapper0" },

                element('input', {
                    key: "ksiinputkey",
                    className: "ksiinput",
                    placeholder: "Kid ID",
                    value: KID,
                    onChange: (e) => setID(e.target.value),
                }), // input

            ), // div wrapper

            element('div', { key: "kidsignininputWrapper1", className: "kidsignininputWrapper1" },

                element('button', {
                    key: "ksibutton",
                    className: "ksibutton",
                    onClick: signin,
                }, "Sign In"), // button

            ), // div wrapper

        ]
    ); // return

}// defualt function