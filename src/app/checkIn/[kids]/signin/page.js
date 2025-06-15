/********************************************
 * Kids sign in page
*********************************************/
'use client'

import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, updateDoc, collection } from "firebase/firestore";
import { db } from '@/app/lib/firebase';
import { Bouncy } from 'ldrs/react'
import 'ldrs/react/Bouncy.css'

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


    useEffect(() => { /* pretty much get the date and preload the database will probably move this to the layout page */
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
            const attendanceCollectionReference = collection(db, "attendance"); // this is a reference to the collection not the actuall collection
            const attendanceDocumentReference = doc(attendanceCollectionReference, monthYear); // reference to doc in collection

            try {
                /**  Read: Attempt to get the document for the current month/year **/

                console.log(`Attempting to preload attendance for ${monthYear}...`);
                const docSnap = await getDoc(attendanceDocumentReference); // this is the actuall doc

                if (docSnap.exists()) { // if it exists save the data to the variable monthAttendance
                    setMonthAttendance(docSnap.data());
                    console.log(`Preloaded data for ${monthYear}.`);
                }
                else {
                    /* if it doesn't exists create an emtpy map
                     * This signals its ready to be created
                    **/
                    setMonthAttendance({});
                    console.log(`No existing data for ${monthYear}, ready to create.`);
                }

            }// try
            catch (e) {
                alert("sorry something went wrong please reload the page.")
                setMonthAttendance(null);
                console.error("Error preloading month attendance:", e);
            }
            finally {
                setisLoading(false);
                // console.log("rememebr to comment setisLoading back in in the finally")
            }
        }; // preload

        /* run the function to preload the database */
        preload();

        /* if i want this effect to rerun when a variable is changed add that variable inside the [] */
    }, []); // useEffect

    const signin = async (e) => {
        /* do some checks */
        const kidId = KID.trim(); // remove whitespace from ends of text
        if (!kidId) { // make sure the user types something in
            alert("Please type your kid's ID to sign them in.");
            return;
        }

        /* create the variables needed */
        const period = hour < 12 ? 'morning' : 'afternoon'

        // Re-calculate references
        const monthYearDocId = `${month}-${year}`;
        const attendanceCollectionRef = collection(db, "attendance");
        const attendanceDocRef = doc(attendanceCollectionRef, monthYearDocId);

        try {
            // **DATABASE READ (Leveraging Preload)**
            // Determine if the document for the current month exists based on preloaded data.
            // If preloadedMonthAttendance is an empty object ({}), it means it didn't exist.
            // If it's a non-empty object, it means it existed and its data was loaded.
            const docExistsFromPreload = monthAttendance && Object.keys(monthAttendance).length > 0;

            if (docExistsFromPreload) {
                // If the document existed (as per preload), we proceed to UPDATE it.
                console.log("Using preloaded month document data for update.");
                // Create a mutable copy of the preloaded data to work with.
                const currentMonthData = { ...monthAttendance };

                // Safely access nested data, initializing empty objects if paths don't exist.
                const dayData = currentMonthData[day] || {};
                const kidAttendance = dayData[kidId] || { morning: false, afternoon: false };

                // check if the kid is already signed in
                if (kidAttendance && kidAttendance[period]) {
                    alert(`Kid ${kidId} already signed in for ${period} classes.`);
                    setID('');
                    return;
                }

                // Update the attendance for the specific kid and period.
                kidAttendance[period] = true;
                // kidAttendance[`checkInTimestamp${period.charAt(0).toUpperCase() + period.slice(1)}`] = timestamp;

                // Construct the Firestore dot-notation path for the update.
                const updatePath = `${day}.${kidId}`;

                // **DATABASE WRITE: updateDoc()**
                // Update only the specific nested field within the document.
                await updateDoc(attendanceDocRef,
                    {
                        [updatePath]: kidAttendance
                    }
                );

                alert(`Kid ${kidId} checked in for ${period} class.`);

                // OPTIONAL: Keep local preloaded state in sync with the database after write.
                // This ensures if you immediately check another kid, the preloaded data is fresh.
                setMonthAttendance(prevData => {
                    const newData = { ...prevData };
                    if (!newData[day]) newData[day] = {}; // Ensure day map exists
                    newData[day][kidId] = kidAttendance; // Update kid's entry
                    return newData;
                });

            } else {
                // If the document did NOT exist (as per preload), we proceed to CREATE it.
                console.log("Creating new month document based on preload status.");
                // Define the structure for the new document.
                const newDocData = {
                    [day]: { // The day number is the top-level field
                        [kidId]: { // Contains the kid's attendance for that day
                            morning: period === 'morning',
                            afternoon: period === 'afternoon',
                            // [`checkInTimestamp${period.charAt(0).toUpperCase() + period.slice(1)}`]: timestamp
                        }
                    }
                };

                // **DATABASE WRITE: setDoc()**
                // Create a new document in Firestore.
                await setDoc(attendanceDocRef, newDocData);
                alert(`${kidId} checked in for ${period}.`);

                // OPTIONAL: Update local preloaded state to reflect the newly created document.
                setMonthAttendance(newDocData);

            } // else
            setID('');
        } catch (e) {
            console.error("Error checking in kid: ", e);
            setError("Failed to check in kid. Please try again.");
        }

    } // signin

    /* cool little loading screen */
    if (isLoading) return <div className='signinkidbouncydiv'>
        <Bouncy
            className="kidsigninBouncy"
            size="200"
            speed="1.75"
            color="black"
        />
    </div>

    return element('div', { className: "kidsigninMainDiv" },
        [
            element('p', { key: "kidsigninH2", className: "kidsigninH2" }, "Sign In Kid"), // heading 2

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
                    placeholder: "Kid ID (example: 00003)",
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
    ); // return main element

}// defualt function