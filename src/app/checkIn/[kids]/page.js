/********************************************
 * kids/page.js 
*********************************************/
'use client';

import Link from "next/link";

export default function chick() {
    return (
        <div>
            <div className="myCenterX">
                <h1>Kids Check In</h1>
            </div>
            <div className="row">
                <Link href="/checkIn/kids/signin" className="box">
                    <div>
                        <h1>Sign In</h1>
                    </div>
                </Link>
                <Link href="/checkIn/kids/reg" className="box">
                    <div>
                        <h1>Register</h1>
                    </div>
                </Link>
            </div>
        </div >
    );
}

