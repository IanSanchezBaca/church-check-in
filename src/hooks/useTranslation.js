/********************************************
 * useTranslation.js
 * This is a custom hook to get the text and swap them from english to spanish
*********************************************/

import { useContext } from "react";
import { LangContext } from "@/context/LangContext";

/* importing the translation files */
import enTranslation from '../translations/en.json'
import esTranslation from '../translations/es.json'

/* making them into one object */
const translations = {
    en: enTranslation,
    es: esTranslation,
};

export const useTranslation = () => {
    const context = useContext(LangContext);

    if (context === null) {
        throw new Error('useTranslation must be used within a LangProvider')
    }

    const { currLang } = context;

    /* fallback if lang or tranlastions are not ready */
    const selectedTranslations = translations[currLang] || enTranslation;


    /* function to get the translated string for a given key??? */
    // const t = (key) => {
    //     return translations[currLang][key] || key;
    // }

    const t = (key) => {
        return selectedTranslations[key] || `[${key}]`;
    }

    return { t, currLang };
}; 