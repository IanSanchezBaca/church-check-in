/********************************************
 * kids/register/page.js 
*********************************************/
//// This tells Next.js that the component runs in the browser and can use state, events, etc.
'use client';

import "../../../globals.css";
import React, { useState, useContext } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getNextKidId } from "@/app/lib/firebaseUtils";
import { useRouter } from 'next/navigation'

import { EagleKidsPreloadContext } from '@/context/EagleKidsPreload';

import { Bouncy } from 'ldrs/react'
import 'ldrs/react/Bouncy.css'

import { useTranslation } from '@/hooks/useTranslation';



export default function RegisterPage() {
    const { t } = useTranslation(); // used for translations

    const {
        parentsDB,
        parentsDBIsLoading,
    } = useContext(EagleKidsPreloadContext);



    /* parent info */
    const [pFirstname, setpfn] = useState("");
    const [pLastname, setpln] = useState("");
    const [pPhone, setP] = useState("");
    const [emergency, setE] = useState("");

    /* State Hooks
     * parent stores first name, last name, phone, emergency contact.
     * kids is an array of kid objects (one or more). 
    **/
    // const [parent, setParent] = useState({
    //     firstName: "",
    //     lastName: "",
    //     phone: "",
    //     emergency: ""
    // });

    const [kids, setKids] = useState([
        {
            firstName: "",
            lastName: "",
            birthdate: "",
            allergies: ""
        }
    ]);

    /* Event Handlers
     * handleParentChange(field, value)
     ** Updates the parent state when an input is typed in.

     * handleKidChange(index, field, value)
     ** Updates a specific kid's info at a given position in the list.

     * addAnotherKid()
     ** Adds an empty new kid object to the kids array.
    **/
    // const handleParentChange = (field, value) => {
    //     setParent({ ...parent, [field]: value });
    // };

    const handleKidChange = (index, field, value) => {
        const newKids = [...kids];
        newKids[index][field] = value;
        setKids(newKids);
    };

    const addAnotherKid = () => {
        setKids([...kids, { firstName: '', lastName: '', birthdate: '', allergies: '' }]);
    };

    const handleSubmit = async (e) => {
        /*Prevents default form submission
         * from my understanding this makes it so that they cant submit a blank form
        */

        e.preventDefault(); // this makes it so that the page doesnt refresh and clear the inputs

        // kids.forEach((kid, index) => {
        //     // alert(`Kid #${index + 1};`, kid);
        //     console.log(`Kid #${index + 1};`, kid)
        // })

        console.log("Prepare: \n", parentsDB)

        // return



        // // Add kid IDs
        // const kidsWithId = await Promise.all(
        //     kids.map(async (kid) => ({
        //         ...kid,
        //         id: await getNextKidId()
        //     }
        //     ))
        // );

        // /*Saves the parent and all kids together into Firestore as one document*/
        // try {
        //     const parentRef = await addDoc(collection(db, 'parents'), {
        //         ...parent,
        //         kids: kidsWithId,
        //         createdAt: new Date().toISOString()
        //     });

        //     alert('Reg complete!');

        //     useRouter.push("/checkIn/kids");

        //     // Reset form
        //     setParent({ firstName: '', lastName: '', phone: '', emergency: '' });
        //     setKids([{ firstName: '', lastName: '', birthdate: '', allergies: '' }]);
        // } catch (err) {
        //     console.error(err);
        //     alert('Error saving to database.');
        // }
    }; // handle submit


    /* cool little loading screen */
    if (parentsDBIsLoading) return <div className='signinkidbouncydiv'>
        <Bouncy
            className="kidsigninBouncy"
            size="200"
            speed="1.75"
            color="black"
        />
    </div>

    return (
        <div className="parentRegMainDiv">
            <form onSubmit={handleSubmit} className="parentRegMainForm">
                {/* Parent info */}
                <h2 className="parentInfoHeader, parentRegH2">
                    {t("ParentInfoHeader")}
                </h2>

                {/* Parent inputs */}
                <div>{/* first name */}
                    <p className="parentRegP">{t("FirstNameTxt")} *</p>
                    <input
                        type="text"
                        required
                        onChange={(e) => setpfn(e.target.value.trim())}
                    />
                </div>

                <div>{/* last name */}
                    <p className="parentRegP">{t("LastNameTxt")} *</p>
                    <input
                        type="text"
                        required
                        onChange={(e) => setpln(e.target.value.trim())}
                    />
                </div>

                {/* Phone numbers will work differently */}
                <div>{/*  phone Number */}
                    <p className="parentRegP">{t("PhoneTxt")} *</p>
                    <input
                        type="tel"
                        pattern="[0-9]{10}"
                        placeholder="1234567890"
                        required
                        style={{ textAlign: "center" }}
                        onChange={(e) => setP(e.target.value.trim())}
                    />

                </div>

                <div> {/* emergency contact */}
                    <p className="parentRegP">{t("EmergencyContactTxt")}</p>
                    <input
                        style={{ textAlign: "center" }}
                        type="tel"
                        pattern="[0-9]{10}"
                        onChange={(e) => setE(e.target.value.trim())}
                        placeholder="0123456789"
                    />
                </div>

                {/* kid info */}
                <h2 className="kidInfoHeader, parentRegH2">{t("KidInfoHeader")}</h2>

                {kids.map((kid, index) => (
                    <div key={`kid-${index}`} className="parentRegKidInfo">
                        {/* Header */}
                        <h2 key={`label-${index}`} className="parentRegKidNum">
                            {`${t("literarlyjustkid")} #${index + 1}`}
                        </h2>

                        {/* Kid Firstname */}
                        <div>
                            <p className="parentRegP">{t("FirstNameTxt")} *</p>
                            <input
                                type="text"
                                required
                                value={kid.firstName}
                                onChange={(e) => handleKidChange(index, "firstName", e.target.value.trim())}
                            />
                        </div>

                        {/* Kid LastName */}
                        <div>
                            <p className="parentRegP">{t("LastNameTxt")} *</p>
                            <input
                                type="text"
                                required
                                value={kid.lastName}
                                onChange={(e) => handleKidChange(index, "lastName", e.target.value.trim())}
                            />
                        </div>

                        {/* kid birthdate */}
                        <div>
                            <p className="parentRegP">{t("BirthDateTxt")} *</p>
                            {/* month */}
                            <input
                                className="birthdateInput"
                                type="text"
                                pattern="[0-9]{2}"
                                placeholder="09"
                                required

                                value={kid.birthdate.split("/")[0] || ""} // not really sure what its doing here
                                onChange={(e) => {
                                    const val = e.target.value.trim();
                                    const parts = kid.birthdate.split("/");
                                    const updated = [val, parts[1] || "", parts[2] || ""];
                                    handleKidChange(index, "birthdate", updated.join("/"));
                                }}
                            />
                            {/* day */}
                            <input
                                className="birthdateInput"
                                type="text"
                                pattern="[0-9]{2}"
                                placeholder="23"
                                required

                                value={kid.birthdate.split("/")[1] || ""}
                                onChange={(e) => {
                                    const val = e.target.value.trim();
                                    const parts = kid.birthdate.split("/");
                                    const updated = [parts[0] || "", val, parts[2] || ""];
                                    handleKidChange(index, "birthdate", updated.join("/"));
                                }}
                            />
                            {/* day */}
                            <input
                                className="birthdateInput"
                                type="text"
                                pattern="[0-9]{4}"
                                placeholder="2001"
                                required

                                value={kid.birthdate.split("/")[2] || ""}
                                onChange={(e) => {
                                    const val = e.target.value.trim();
                                    const parts = kid.birthdate.split("/");
                                    const updated = [parts[0] || "", parts[1] || "", val];
                                    handleKidChange(index, "birthdate", updated.join("/"));
                                }}
                            />
                        </div>

                        {/* Kid Allergies */}
                        <div>
                            <p className="parentRegP">{t("AllergiesTxt")}</p>
                            <input
                                type="text"
                                value={kid.allergies}
                                onChange={(e) => handleKidChange(index, "allergies", e.target.value.trim())}
                            />
                        </div>

                        {/* This is the delete button code that should be popping up */}
                        {index > 0 && (
                            <div className="delete-button-container"> {/* Added className for styling */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        const updatedKids = [...kids];
                                        updatedKids.splice(index, 1);
                                        setKids(updatedKids);
                                    }}
                                    className="delete-button"
                                >
                                    {t("DeleteKidBtnTxt")}
                                </button>
                            </div>
                        )}
                    </div>

                ))} {/* this is the end of the map */}

                <div>
                    <button
                        onClick={addAnotherKid}
                        className="kidAddBtn">
                        {t("AddAnotherKidBtnTxt")}
                    </button>
                </div>

                <div className="submitButtonContainer">
                    <button
                        type="submit"
                        className="submitButton"
                    >
                        {t("SubmitbtnTxt")}
                    </button>
                </div>

            </form>
        </div >
    )
} // checkinpage



// return React.createElement('form', { onSubmit: handleSubmit },
//     [React.createElement('h2', { key: 'heading-parent' }, t("ParentInfoHeader"))].concat(
//         // ['firstName', 'lastName', 'phone', 'emergency'].map((field) =>
//         [t("FirstNameTxt"), t("LastNameTxt"), t("PhoneTxt"), t("EmergencyContactTxt")].map((field) =>
//             React.createElement('input', {
//                 key: `parent-${field}`,
//                 placeholder: field.charAt(0).toUpperCase() + field.slice(1) + (field !== 'emergency' ? ' *' : ''),
//                 value: parent[field],
//                 onChange: e => handleParentChange(field, e.target.value)
//             })
//         ),

//         [React.createElement('h2', { key: 'heading-kids' }, t("KidInfoHeader"))],
//         kids.map((kid, index) =>
//             React.createElement('div', { key: `kid-${index}`, className: 'kidDiv' }, [
//                 React.createElement('p', { key: `label-${index}` }, `${t("literarlyjustkid")} #${index + 1}`),
//                 ...[t("FirstNameTxt"), t("LastNameTxt"), t("BirthDateTxt"), t("AllergiesTxt")].map(field =>
//                     React.createElement('input', {
//                         key: `kid-${index}-${field}`,
//                         placeholder: field.charAt(0).toUpperCase() + field.slice(1) + (field !== 'allergies' ? ' *' : ''),
//                         value: kid[field],
//                         onChange: e => handleKidChange(index, field, e.target.value)
//                     })
//                 ),
//                 index > 0 && /* adds a delete button for kid 2 and greater */
//                 React.createElement('div', { className: 'delete-button-container', key: `delete-wrap-${index}` }, [
//                     React.createElement('button', {
//                         key: `delete-${index}`,
//                         type: 'button',
//                         onClick: () => {
//                             const updatedKids = [...kids];
//                             updatedKids.splice(index, 1);
//                             setKids(updatedKids);
//                         },
//                         className: 'delete-button'
//                     }, t("DeleteKidBtnTxt"))
//                 ])
//             ])
//         ),

//         [
//             React.createElement('button', {
//                 type: 'button',
//                 key: 'add-kid',
//                 onClick: addAnotherKid,
//                 className: 'kidAddBtn',
//             }, t("AddAnotherKidBtnTxt")),

//             React.createElement(
//                 'div',
//                 {
//                     key: `submit-button-container`,
//                     className: 'submitButtonContainer'
//                 },
//                 [
//                     React.createElement('button', {
//                         type: 'submit',
//                         key: 'submit',
//                         className: 'submitButton'
//                     }, t("SubmitbtnTxt"))
//                 ]
//             )
//         ]
//     )
// ); // return