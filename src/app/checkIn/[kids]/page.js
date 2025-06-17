/********************************************
 * kids/page.js 
*********************************************/
'use client';
/* loading screen */
import { Bouncy } from 'ldrs/react'
import 'ldrs/react/Bouncy.css'

import React, { useContext } from 'react';
import Link from "next/link";
import AdminButton from "@/app/lib/adminButton";

import { EagleKidsPreloadContext } from '@/context/EagleKidsPreload';


export default function Chick() {
    const {
        // isAdmin,
        // userData,
        // day, month, year, hour, min, currDate,
        // AttendanceDB,
        attendanceIsLoading,
        // parentsDB,
        parentsDBIsLoading,
        // updatePreloadedAttendance,
    } = useContext(EagleKidsPreloadContext);

    /* cool little loading screen */
    if (attendanceIsLoading && parentsDBIsLoading) return <div className='signinkidbouncydiv'>
        <Bouncy
            className="kidsigninBouncy"
            size="200"
            speed="1.75"
            color="black"
        />
    </div>


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

