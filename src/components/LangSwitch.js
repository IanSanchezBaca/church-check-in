/********************************************
 * LangSwitch.js
 * This is the component that goes into the html code to switch the text
*********************************************/
'use client';

import React from "react";
import { useLang } from "@/context/LangContext";
import { useTranslation } from "@/hooks/useTranslation";



const LangSwitch = () => {
    const { toggleLang } = useLang();
    const { t, currLang } = useTranslation();

    return (
        <div className="NAVBAR">
            <button onClick={toggleLang} className="LangSwitchBtn">
                {t('language_switch_button')}
            </button>
        </div>
    );
};// const LangSwitch

export default LangSwitch;

