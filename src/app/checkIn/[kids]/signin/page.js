/********************************************
 * Kids sign in page
*********************************************/
'use client'

import React, { useEffect, useState, useContext } from 'react';
import { doc, /*getDoc,*/ setDoc, updateDoc, collection } from "firebase/firestore"; // i no longer need to get doc here
import { db } from '@/app/lib/firebase'; //this is no longer needed since im using context

import { Bouncy } from 'ldrs/react'
import 'ldrs/react/Bouncy.css'


const { createElement: element } = React

import { EagleKidsPreloadContext } from '@/context/EagleKidsPreload';


export default function SignInPage() {
    const {
        // isAdmin,
        // userData,
        day, month, year, hour, min, currDate,
        AttendanceDB,
        attendanceIsLoading,
        parentsDB,
        parentsDBIsLoading,
        updatePreloadedAttendance,
    } = useContext(EagleKidsPreloadContext);

    const [KID, setID] = useState(""); // this is for the kid sign in
    let kidname = "";
    let ID = "";

    function padStringManually(str) {
        const s = String(str);
        const desiredLength = 5;
        const padChar = '0';
        let paddedString = s;

        while (paddedString.length < desiredLength) {
            paddedString = padChar + paddedString; // Prepend the padding character
        }

        return paddedString;
    }


    const signin = async () => {
        const kidId = ID // remove whitespace from ends of text


        const currHour = currDate.getHours();
        const period = currHour < 11 ? 'morning' : 'afternoon';

        // Re-calculate references
        const monthYearDocId = `${month}-${year}`;
        const attendanceCollectionRef = collection(db, "attendance");
        const attendanceDocRef = doc(attendanceCollectionRef, monthYearDocId);

        try {
            // **DATABASE READ (Leveraging Preload)**
            // Determine if the document for the current month exists based on preloaded data.
            // If preloadedMonthAttendance is an empty object ({}), it means it didn't exist.
            // If it's a non-empty object, it means it existed and its data was loaded.
            const docExistsFromPreload = AttendanceDB && Object.keys(AttendanceDB).length > 0;

            if (docExistsFromPreload) {
                // If the document existed (as per preload), we proceed to UPDATE it.
                console.log("Using preloaded month document data for update.");
                // Create a mutable copy of the preloaded data to work with.
                const currentMonthData = { ...AttendanceDB };

                // Safely access nested data, initializing empty objects if paths don't exist.
                const dayData = currentMonthData[day] || {};
                const kidAttendance = dayData[kidId] || { morning: false, afternoon: false };

                // check if the kid is already signed in
                if (kidAttendance && kidAttendance[period]) {
                    alert(`${kidname} is already signed in for ${period} classes.`);
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

                alert(`${kidname} is checked in for ${period} class.`);

                updatePreloadedAttendance(prevData => {
                    // IMPORTANT: Create a deep copy to avoid direct mutation of state objects
                    // JSON.parse(JSON.stringify(prevData)) is a simple way for non-complex objects
                    const newData = JSON.parse(JSON.stringify(prevData || {})); // Ensure it's an object even if prevData was null/undefined

                    // Ensure the 'day' property exists on the new data
                    if (!newData[day]) {
                        newData[day] = {};
                    }

                    // Update the specific kid's entry for that day
                    newData[day][kidId] = kidAttendance;
                    return newData; // Return the new, updated state
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
                alert(`${kidname} is checked in for ${period}.`);

                // OPTIONAL: Update local preloaded state to reflect the newly created document.
                updatePreloadedAttendance(newDocData);

            } // else
            setID('');
        } catch (e) {
            console.error("Error checking in kid: ", e);
            console.log("Failed to check in kid. Please try again.");
        }

    } // signin

    const doesKidExists = async () => {
        const t = KID.trim(); // remove whitespace from ends of text
        if (!t) { // make sure the user types something in
            alert("Please type your kid's ID to sign them in.");
            return;
        }

        ID = padStringManually(t).trim();

        let kidExists = false;
        // let kidName = "";
        for (const parent of parentsDB) {
            if (!parent.kids) continue;

            for (const kid of parent.kids) {
                if (ID === kid.id) {
                    kidname = kid.firstName
                    kidExists = true
                    break;
                }
            }

        }



        if (kidExists) {
            // alert(`${kidname} : ${ID} found!`)
            signin();
        }
        else {
            alert(`${ID} is not found. Please register first and ask staff for ID.`);
            setID("");
        }

    } // doesKidExists


    /* cool little loading screen */
    if (attendanceIsLoading && parentsDBIsLoading) return <div className='signinkidbouncydiv'>
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
                    onClick: doesKidExists,
                }, "Sign In"), // button

            ), // div wrapper

        ]
    ); // return main element

}// defualt function

