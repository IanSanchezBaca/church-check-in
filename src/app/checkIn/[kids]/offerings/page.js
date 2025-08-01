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
    } = useContext(EagleKidsPreloadContext);

    // the input vaiables
    const [MONTH, setMonth] = useState("");
    const [DAY, setDay] = useState("");
    const [YEAR, setYear] = useState("");

    // cosmetic variables
    const [currMonth, setCurrMonth] = useState("");
    const [currDay, setCurrDay] = useState("");
    const [currYear, setCurrYear] = useState("");


    const [currOff, setCurrOff] = useState("0");

    useEffect(() => { // run this on startup
        // set the input dates
        setMonth(month);
        setDay(day);
        setYear(year);

        // set the text dates
        setCurrDay(day);
        setCurrMonth(month);
        setCurrYear(year);




        // use [] so that it doesnt run repeatedly
    }, [day, month, year]); //useEffect

    // check if is admin
    if (!isAdmin) {
        return (
            <div>Woops!</div>
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
                <button>search</button>
            </div>

            <div style={{ textAlign: "center", marginTop: "3rem" }}>
                <h2>Offerings on {currMonth}/{currDay}/{currYear}: {currOff} </h2>
                <input
                    placeholder="1.00"
                />
                <div style={{ textAlign: "center", marginTop: ".5rem" }}>
                    <button>
                        Update Value
                    </button>
                </div>
            </div>

            {/* <footer style={{ textAlign: "center", marginTop: "10rem" }}>
                <p>
                    * If offerings is -1, this means that there is no offerings for that day.
                </p>
            </footer> */}
        </div>
    ); // return



}