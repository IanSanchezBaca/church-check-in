/********************************************
 * kids/layout.js 
*********************************************/
'use client';

import { EagleKidsPreloadProvider } from "@/context/EagleKidsPreload";

export default function PreLoadDB({ children }) {
    return (
        <div>
            <EagleKidsPreloadProvider>
                {children}
            </EagleKidsPreloadProvider>
        </div>
    )
}