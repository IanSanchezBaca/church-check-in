/********************************************
 * checkIn/layout.js
*********************************************/
/* loading screen
import { Bouncy } from 'ldrs/react'
import 'ldrs/react/Bouncy.css'
*/

import { EagleKidsPreloadProvider } from "@/context/EagleKidsPreload";


export const metadata = {
    title: 'Check in',
    description: 'This is the check in page.'
};

export default function chickenLayout({ children }) {
    return (
        <div className="chickenMainDiv">
            <EagleKidsPreloadProvider>
                {children}
            </EagleKidsPreloadProvider>
        </div>
    );
}

// background-color: rgb(251, 255, 178);