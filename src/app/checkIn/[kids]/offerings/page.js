/********************************************
 * kids/offerings/page.js
 * This is a simple page where you 
 * - can choose a date
 * - update that date's total offering
*********************************************/
'use client';

import { db } from '@/app/lib/firebase';
import { EagleKidsPreloadContext } from '@/context/EagleKidsPreload';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState, useContext } from 'react';

export default function OfferingsPage() {
    // context
    const {
        day, month, year,
        isAdmin,
        AttendanceDB, // really only used for the current day's offerings
    } = useContext(EagleKidsPreloadContext);

    // the input vaiables
    const [MONTH, setMonth] = useState("");
    const [DAY, setDay] = useState("");
    const [YEAR, setYear] = useState("");

    // cosmetic variables
    const [currMonth, setCurrMonth] = useState("");
    const [currDay, setCurrDay] = useState("");
    const [currYear, setCurrYear] = useState("");

    const [inputOff, setInputOff] = useState(0);
    const [currOff, setCurrOff] = useState(0);
    const [start, setStart] = useState(true);


    const checkChange = () => {
        return MONTH === currMonth && DAY === currDay && YEAR === currYear;
    }


    const handleSearch = async () => {// will search for a specific day's offerings
        if (checkChange() && !start) { // check if date was changed before searching
            console.log("Nothing was updated.")
            return;
        }

        const monthYear = MONTH + "-" + YEAR;
        // console.log(monthYear);

        const attendanceDocRef = doc(db, "attendance", monthYear);

        try {
            const docSnap = await getDoc(attendanceDocRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                const offVal = data?.[DAY]?.Offerings ?? 0;
                // console.log(offVal);
                setCurrOff(offVal);
            } else {
                setCurrOff(0);
            }

        } catch (error) {
            console.error("KidsOfferingsPage: error fetching offerings: ", error);
            setCurrOff(0);
        }

        setCurrDay(DAY);
        setCurrMonth(MONTH);
        setCurrYear(YEAR);


    }

    const handleUpdate = async () => { // will update a specific day's offerings
        let monthYear = MONTH + "-" + YEAR;

        const attendanceDocRef = doc(db, "attendance", monthYear);

        try {
            const docSnap = await getDoc(attendanceDocRef);

            let updatedData = {};
            if (docSnap.exists()) {
                const data = docSnap.data();

                // make sure teh current day field exists
                if (!data[DAY]) {
                    data[DAY] = {};
                }

                // if offerings doesnt exist, set it to zero
                if (data[DAY].Offerings === undefined) {
                    data[DAY].Offerings = 0;
                }

                data[DAY].Offerings = parseFloat(inputOff) || 0;

                updatedData = { [DAY]: data[DAY] };

            } else {
                updatedData = {
                    [DAY]: {
                        Offerings: parseFloat(inputOff) || 0
                    }
                };
            }

            await setDoc(attendanceDocRef, updatedData, { merge: true });
            setCurrOff(inputOff);
            // alert("Offering Updated!");

        } catch (error) {
            console.error("KidsOfferingsPage: Failed to update offerings: ", error);
        }

    }


    useEffect(() => { // run this on startup
        // set the input dates
        setMonth(month);
        setDay(day);
        setYear(year);

        // set the text dates
        setCurrDay(day);
        setCurrMonth(month);
        setCurrYear(year);

        // // this will only really run once and only for the first start up
        // if (AttendanceDB && Object.keys(AttendanceDB).length > 0) {
        //     if (AttendanceDB.Offerings) {
        //         setCurrOff(AttendanceDB.Offerings)
        //     }
        // } else {
        //     console.log("OfferingsPage: There is nothing inside of attendanceDB")
        // }

        handleSearch();
        setStart(false);

        // use [] so that it doesnt run repeatedly
    }, [day, month, year, AttendanceDB]); //useEffect

    // check if is admin
    if (!isAdmin) {
        return (
            <div style={{ textAlign: "center" }}>
                <h1>404 Not found. lol</h1>
            </div>
        )
    }


    // this function will get the offering from the current date
    // const getOffering = async () => { } // getOffering


    return (
        <div>
            <h1 style={{ textAlign: "center" }}>Offerings</h1>

            <div className="offeringsPageDate" style={{ textAlign: "center" }}>
                <div style={{ textAlign: "center" }}>Date</div>
                <input // month
                    placeholder="month"
                    value={MONTH}
                    onChange={(e) => setMonth(e.target.value.trim())}
                />
                <input // day
                    placeholder="day"
                    value={DAY}
                    onChange={(e) => setDay(e.target.value.trim())}
                />
                <input // year
                    placeholder="year"
                    value={YEAR}
                    onChange={(e) => setYear(e.target.value.trim())}
                />
            </div>

            <div style={{ textAlign: "center", marginTop: ".5rem" }}>
                <button
                    onClick={handleSearch}
                >
                    Search
                </button>
            </div>

            <div style={{ textAlign: "center", marginTop: "3rem" }}>
                <h2>
                    Offerings on {currMonth}/{currDay}/{currYear}: ${currOff}
                </h2>
                <input
                    placeholder="1.99"
                    type="number"
                    step={"0.01"}
                    onChange={(e) => setInputOff(e.target.value.trim())}
                />
                <div style={{ textAlign: "center", marginTop: ".5rem" }}>
                    <button
                        onClick={handleUpdate}
                    >
                        Update Value
                    </button>
                </div>
            </div>


        </div>
    ); // return



}