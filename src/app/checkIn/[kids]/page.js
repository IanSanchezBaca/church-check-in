/********************************************
 * kids/page.js 
*********************************************/
'use client';

import Link from "next/link";
import AdminButton from "@/app/lib/adminButton";

export default function Chick() {
    return (
        <div>
            <div>
                <h1 className="kidschickenh1">Kids Check In</h1>
            </div>
            <div className="row">
                <Link href="/checkIn/kids/signin" className="box">
                    <div>
                        <p>Sign In Kid(s)</p>
                    </div>
                </Link>
                <Link href="/checkIn/kids/reg" className="box">
                    <div>
                        <p>Register Kid(s)</p>
                    </div>
                </Link>
            </div>
            <div><AdminButton /></div>
        </div >

    );
}

