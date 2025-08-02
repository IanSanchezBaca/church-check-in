/********************************************
 * kids/offerings/page.js
 * This is a simple page where you 
 * - can choose a date
 * - update that date's total offering
*********************************************/
'use client';

import { EagleKidsPreloadContext } from '@/context/EagleKidsPreload';
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


    const [currOff, setCurrOff] = useState(0);


    const handleSearch = async () => {
        // will search for a specific day's offerings
        console.log(`Looking for ${MONTH}-${DAY}-${YEAR}`)
        let monthYear = MONTH + "-" + YEAR;

        console.log(monthYear)

    }

    const handleUpdate = async () => {
        // will update a specific day's offerings
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

        // this will only really run once and only for the first start up
        if (AttendanceDB && Object.keys(AttendanceDB).length > 0) {
            if (AttendanceDB.Offerings) {
                setCurrOff(AttendanceDB.Offerings)
            }
        } else {
            console.log("OfferingsPage: There is nothing inside of attendanceDB")
        }

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
                />
                <div style={{ textAlign: "center", marginTop: ".5rem" }}>
                    <button>
                        Update Value
                    </button>
                </div>
            </div>


        </div>
    ); // return



}