/********************************************
 * LangContext.js
 * Apperantly this isnt a component, but is just something else but is still being use as context
*********************************************/
'use client'

import React, { createContext, useState, useEffect, useContext, Children } from "react"

/* creating the language context */
export const LangContext = createContext(null);

/* creating the provider component */

export const LangProvider = ({ children }) => {

    /* state to hold the current language */
    // const [currLang, setCurrLang] = useState(() => {
    //     if (typeof window !== 'undefined') { // check if in browser enviroment
    //         return localStorage.getItem('appLanguage') || 'en';
    //     }
    //     return 'en'
    // });

    const [currLang, setCurrLang] = useState('es'); // i want the default to be spanish

    useEffect(() => {
        const storedLang = localStorage.getItem('appLanguage');
        if (storedLang && storedLang !== currLang) {
            setCurrLang(storedLang);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('appLanguage', currLang);
    }, [currLang]); // rerun if currLang changes

    const toggleLang = () => {
        setCurrLang(prevLang => (prevLang === 'en' ? 'es' : 'en'));
    };

    const contextValue = {
        currLang,
        toggleLang,
    };

    return (
        <LangContext.Provider value={contextValue}>
            {children}
        </LangContext.Provider>
    )

}; // export const LangProvider



// Optional: Custom hook to easily consume the language context
// While we'll have a more comprehensive useTranslation hook later,
// this is useful if you just need the current language or toggle function.
export const useLang = () => {
    const context = useContext(LangContext);
    if (context === null) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};