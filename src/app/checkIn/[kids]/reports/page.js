/********************************************
 * kids/reports/page.js
 * Here you can get the attendance of the
*********************************************/
'use client';

import { EagleKidsPreloadContext } from '@/context/EagleKidsPreload';
import React, { useEffect, useState, useContext } from 'react';
import Image from 'next/image'
import { doc, getDoc, getDocs, collection, query, where, FieldPath, documentId } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';



export default function ReportsPage() {
    // context
    const {
        day, month, year,
        isAdmin,
        parentsDB,
    } = useContext(EagleKidsPreloadContext);

    /* Left side */
    const [monthL, setMonthL] = useState("");
    const [dayL, setDayL] = useState("");
    const [yearL, setYearL] = useState("");
    /* Right side */
    const [monthR, setMonthR] = useState("");
    const [dayR, setDayR] = useState("");
    const [yearR, setYearR] = useState("");

    const [attendanceDocs, setAttendanceDB] = useState(null);

    let newKidCount = 0;





    useEffect(() => { // run this on startup
        setMonthL(month);
        setDayL(day);
        setYearL(year);
        // use [] so that it doesnt run repeatedly
    }, [day, month, year]); //useEffect

    // check if the user is an admin
    if (!isAdmin) return (
        <div>
            <h1 style={{ textAlign: "center" }}>
                Loading...
            </h1>
            <div style={{ textAlign: "center" }}>
                <Image
                    unoptimized
                    src='/Rito1.gif'
                    alt='gif image lol'
                    height={100}
                    width={100}
                />
            </div>
        </div>
    )

    /* checks */
    const checkLeft = () => {
        return monthL && dayL && yearL;
    }
    const checkRight = () => {
        return monthR && dayR && yearR;
    }

    const resetCount = () => {
        newKidCount = 0;
    };

    const addCount = () => {
        newKidCount++;
    };

    // This will be the function that will be called when print button is pressedd
    const Print = async () => {

    }


    // this will be called when the search button is pressed
    const handleSearch = async () => {
        if (checkLeft()) {
            console.log("Left Side Filled.")
            let monthYearL = monthL + "-" + yearL;
            let monthYearR = "";

            if (!checkRight()) {
                monthYearR = monthYearL;
                // dayR = dayL;
                setDayR(dayL);
            }
            else {
                monthYearR = monthR + "-" + yearR;
            }

            try {

                console.log("reports page: Check if document exists.");
                console.log(`from ${monthYearL} to ${monthYearR}`);

                const q = query(
                    collection(db, "attendance"),
                    where(documentId(), ">=", monthYearL),
                    where(documentId(), "<=", monthYearR),
                );

                const snapshot = await getDocs(q);

                const results = [];
                // snapshot.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
                snapshot.forEach(doc => {
                    const filteredDays = Object.fromEntries(
                        Object.entries(doc.data()).filter(([day]) => {
                            const dayNum = parseInt(day, 10);
                            return dayNum >= parseInt(dayL, 10) && dayNum <= parseInt(dayR, 10);
                        })
                    );
                    results.push({ id: doc.id, ...filteredDays });
                });

                setAttendanceDB(results);

            }
            catch (e) {
                setAttendanceDB(null);
                console.error("Error: no data found?: ", e);
            }

        }
        else {
            alert("Please type in a date.")
        }

    }

    return (
        <div className="ReportsPageMainDiv">
            <div>
                <h2 className="ReportsH2">
                    Date Range
                </h2>
                <button className='printButton'>Print</button>
            </div>

            <div className="ReportsPageInputsContainer">


                <div className="ReportsPageLeft">
                    <div style={{ textAlign: "center" }}>Start Date</div>
                    <input // monthL                        
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
                    <div style={{ textAlign: "center" }}>End Date</div>
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

            <div className="ReportsPageButtonContainer">
                <button
                    className="ReportsPageSearchButton"
                    onClick={handleSearch}
                >
                    search
                </button>
            </div>


            {attendanceDocs?.map((doc, index) => (
                <div key={index} className='ReportsPageList kdbcard'>
                    <h2>
                        {doc.id}
                    </h2>

                    {Object.entries(doc).map(([day, kids]) => (
                        day !== "id" && (
                            <div key={day} className="attendanceDay kdbcard">
                                <h4>
                                    Day: {day}
                                </h4>

                                {resetCount()}

                                {Object.entries(kids).map(([kidId, status]) => {
                                    const kidEntry = parentsDB
                                        .flatMap(parent => parent.kids?.map(kid => ({ ...kid, createdAt: parent.createdAt })) || [])
                                        .find(k => k.id === kidId);

                                    const kidName = kidEntry
                                        ? `${kidEntry.firstName} ${kidEntry.lastName}`
                                        : kidId;

                                    const isNew = kidEntry?.createdAt
                                        ? new Date(kidEntry.createdAt).getDate().toString().padStart(2, '0') === day
                                        : false;

                                    if (isNew) {
                                        addCount();
                                    }

                                    return (
                                        <div key={kidId} className="kdbcard">
                                            <p className="kdbkidid">
                                                {kidName} {isNew && <span style="color: green">🌟 New 🌟</span>}
                                            </p>
                                            <p className="kdbkidstatus">
                                                Morning: {status.morning ? "✅" : "❌"}
                                            </p>
                                            <p className="kdbkidstatus">
                                                Afternoon: {status.afternoon ? "✅" : "❌"}
                                            </p>
                                        </div>
                                    );
                                })}

                                {/* Daily Summary */}
                                <div className="dailySummary">
                                    <p>New Kids: {
                                        newKidCount
                                    }
                                    </p>
                                    <p>Morning: {
                                        Object.values(kids).filter(k => k.morning).length
                                    }</p>
                                    <p>Afternoon: {
                                        Object.values(kids).filter(k => k.afternoon).length
                                    }</p>
                                    <p>Total Kids Attended: {
                                        Object.keys(kids).length
                                    }</p>
                                </div>

                            </div>
                        )
                    ))}

                </div>
            ))}

        </div >
    ) // return html code

} // ReportsPage