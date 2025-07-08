/********************************************
 * kids/reports/page.js
 * Here you can get the attendance of the
*********************************************/
'use client';

import { EagleKidsPreloadContext } from '@/context/EagleKidsPreload';
import React, { useEffect, useState, useContext } from 'react';
import Image from 'next/image'



export default function ReportsPage() {
    // context
    const {
        day, month, year,
        isAdmin


    } = useContext(EagleKidsPreloadContext);

    /* Left side */
    const [monthL, setMonthL] = useState("");
    const [dayL, setDayL] = useState("");
    const [yearL, setYearL] = useState("");
    /* Right side */
    const [monthR, setMonthR] = useState("");
    const [dayR, setDayR] = useState("");
    const [yearR, setYearR] = useState("");


    useEffect(() => {
        setMonthL(month);
        setDayL(day);
        setYearL(year);
    }, [day, month, year]); //useEffect



    // check if the user is an admin
    if (!isAdmin) return (
        <div>
            <h1 style={{ textAlign: "center" }}>
                Loading...
            </h1>
            <div style={{ textAlign: "center" }}>
                <Image
                    src='/Rito1.gif'
                    alt='gif image lol'
                    height={100}
                    width={100}
                />
            </div>
        </div>
    )






    // const handleCheck = async (valye, num) => {}


    // this will be called when the search button is pressed
    const handleSearch = async () => {

        let test = monthL + "-" + yearL;
        // console.log(`${monthL}-${dayL}-${yearL}`)
        console.log(test);

        if (!monthR && !dayR && !yearR) {
            console.log("Right side is not filled.")
        }
    }

    return (
        <div className="ReportsPageMainDiv">
            <h2 className="ReportsH2">
                Date Range
            </h2>
            {/* <form> */}
            <div
                className="ReportsPageInputsContainer"
            >

                <div className="ReportsPageLeft">
                    <input // monthL
                        // type='number'
                        // pattern="[0-9]{2}"
                        className="ReportsPageInput"
                        placeholder="month"
                        value={monthL}
                        onChange={(e) => setMonthL(e.target.value.trim())}
                    />
                    <input // dayL
                        className="ReportsPageInput"
                        placeholder="day"
                        value={dayL}
                        onChange={(e) => setDayL(e.target.value.trim())}
                    />
                    <input // yearL
                        className="ReportsPageInput"
                        placeholder="year"
                        value={yearL}
                        onChange={(e) => setYearL(e.target.value.trim())}
                    />
                </div>

                <div className="ReportsPageMiddle">
                    <p>to</p>
                </div>

                <div className="ReportsPageRight">
                    <input // monthR
                        className="ReportsPageInput"
                        placeholder="month"
                        value={monthR}
                        onChange={(e) => setMonthR(e.target.value.trim())}
                    />
                    <input // dayR
                        className="ReportsPageInput"
                        placeholder="day"
                        value={dayR}
                        onChange={(e) => setDayR(e.target.value.trim())}
                    />
                    <input // yearR
                        className="ReportsPageInput"
                        placeholder="year"
                        value={yearR}
                        onChange={(e) => setYearR(e.target.value.trim())}
                    />
                </div>
            </div>

            {/* <div className='ReportsPageButtonContainer'>
                <button>
                    clear
                </button>
            </div> */}

            <div className="ReportsPageButtonContainer">
                <button
                    className="ReportsPageSearchButton"
                    onClick={handleSearch}
                >
                    search
                </button>
            </div>

            {/* </form> */}

        </div>
    ) // return html code

} // ReportsPage