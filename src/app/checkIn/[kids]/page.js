/********************************************
 * kids/page.js 
*********************************************/
'use client';

import Link from "next/link";
import AdminButton from "@/app/lib/adminButton";

export default function Chick() {
    return (
        <div>
            <div className="myCenterX">
                <h1>Kids Check In</h1>
            </div>
            <div className="row">
                <Link href="/checkIn/kids/signin" className="box" style={{ backgroundColor: "#b4f2f1", color: "black" }}>
                    <div>
                        <p>Sign In Kid(s)</p>
                    </div>
                </Link>
                <Link href="/checkIn/kids/reg" className="box" style={{ backgroundColor: "#b4f2f1", color: "black" }}>
                    <div>
                        <p>Register Kid(s)</p>
                    </div>
                </Link>
            </div>

            <AdminButton />

        </div >
    );
}

