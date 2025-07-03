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
import ReportsButton from '@/components/ReportsButton';

import { EagleKidsPreloadContext } from '@/context/EagleKidsPreload';

import { useTranslation } from '@/hooks/useTranslation';



export default function Chick() {
    const { t } = useTranslation();

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
                <h1 className="kidschickenh1">
                    {/* Kids Check In */}
                    {t('KidsCheckInHeader')}
                </h1>
            </div>

            <div className="row">
                <Link href="/checkIn/kids/signin" className="box">
                    <div>
                        {/* <p> */}
                        {t('SignInKidBtn')}
                        {/* Sign In Kid(s) */}
                        {/* </p> */}
                    </div>
                </Link>
                <Link href="/checkIn/kids/reg" className="box">
                    <div>
                        {t('RegKidBtn')}
                        {/* <p>Register Kid(s)</p> */}
                    </div>
                </Link>
            </div>

            <AdminButton />

            <ReportsButton />

        </div >

    );
}

