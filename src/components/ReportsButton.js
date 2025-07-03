/********************************************
 * ReportsButton.js
 * This component is pretty much just checks if the user
*********************************************/
'use client';

// import { useTranslation } from "@/hooks/useTranslation";
import React, { useContext } from 'react';
import { EagleKidsPreloadContext } from '@/context/EagleKidsPreload';
import Link from "next/link";


const ReportsButton = () => {
    const {
        isAdmin
    } = useContext(EagleKidsPreloadContext);

    return (
        isAdmin && (
            <div className="ReportsButtonDiv">
                <Link href="/checkIn/kids/reports" className="ReportsButtonLink">
                    Reports
                </Link>
            </div>
        )
    );


};// const ReportsButton

export default ReportsButton;

