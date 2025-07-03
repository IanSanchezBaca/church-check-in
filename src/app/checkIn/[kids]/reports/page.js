/********************************************
 * This will be the reports page. 
 * Here you can get the attendance of the
*********************************************/
'use client';

import React, { useContext } from 'react';
import { EagleKidsPreloadContext } from '@/context/EagleKidsPreload';



export default function ReportsPage() {
    const {
        isAdmin
    } = useContext(EagleKidsPreloadContext);

    if (!isAdmin) return (
        <div>
            <h1 style={{ textAlign: "center" }}>
                Uh oh. You should not be here.
            </h1>
        </div>
    )

    return (
        <div className="ReportsPageMainDiv">
            <h2 className="ReportsH2">
                Date Range
            </h2>
            <form>
                <div
                    className="ReportsPageInputsContainer"
                >

                    <div className="ReportsPageLeft">
                        <input
                            className="ReportsPageInput"
                            placeholder="month"
                        />
                        <input
                            className="ReportsPageInput"
                            placeholder="day"
                        />
                        <input
                            className="ReportsPageInput"
                            placeholder="year"
                        />
                    </div>

                    <div className="ReportsPageMiddle">
                        <p>to</p>
                    </div>

                    <div className="ReportsPageRight">
                        <input
                            className="ReportsPageInput"
                            placeholder="month"
                        />
                        <input
                            className="ReportsPageInput"
                            placeholder="day"
                        />
                        <input
                            className="ReportsPageInput"
                            placeholder="year"
                        />
                    </div>
                </div>

                <div className="ReportsPageButtonContainer">
                    <button
                        className="ReportsPageSearchButton"
                    >
                        search
                    </button>
                </div>
            </form>

        </div>
    ) // return html code

} // ReportsPage