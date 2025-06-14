/********************************************
 * Kids sign in page
*********************************************/
'use client'

import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from '@/app/lib/firebase';

const { createElement: element } = React




export default function SignIn() {
    const [KID, setID] = useState(''); // this is for the kid sign in

    // these are for the date
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [hour, setHour] = useState('');
    const [min, setMin] = useState('');

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


    }, []); // useEffect

    const signin = async (e) => {
        if (!KID) { // make sure the user types something in
            alert("Please type your kid's ID to sign them in.");
            return;
        }



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