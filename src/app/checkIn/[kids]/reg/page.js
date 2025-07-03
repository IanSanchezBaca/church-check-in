/********************************************
 * kids/register/page.js 
*********************************************/
//// This tells Next.js that the component runs in the browser and can use state, events, etc.
'use client';

import "../../../globals.css";
import React, { useState, useContext } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, addDoc, updateDoc, arrayUnion, doc } from 'firebase/firestore';
import { getNextKidId } from "@/app/lib/firebaseUtils";
import { useRouter } from 'next/navigation'

import { EagleKidsPreloadContext } from '@/context/EagleKidsPreload';

import { Bouncy } from 'ldrs/react'
import 'ldrs/react/Bouncy.css'

import { useTranslation } from '@/hooks/useTranslation';



export default function RegisterPage() {
    const { t } = useTranslation(); // used for translations

    const router = useRouter();

    const {
        parentsDB,
        parentsDBIsLoading,
    } = useContext(EagleKidsPreloadContext);

    /* parent info */
    const [pFirstname, setpfn] = useState("");
    const [pLastname, setpln] = useState("");
    const [pPhone, setP] = useState("");
    const [emergency, setE] = useState("");

    /* kid(s) info */
    const [kids, setKids] = useState([
        {
            firstName: "",
            lastName: "",
            birthdate: "",
            allergies: ""
        }
    ]);

    /* This updates when ever something is typed into the input fields for the kids */
    const handleKidChange = (index, field, value) => {
        const newKids = [...kids];
        newKids[index][field] = value;
        setKids(newKids);
    };

    /* This adds another set of input fields for more kids */
    const addAnotherKid = () => {
        setKids([...kids, { firstName: '', lastName: '', birthdate: '', allergies: '' }]);
    };

    /* list to add new children to parent */
    // const [pendingKids, setPendingKids] = useState([]);


    const handleSubmit = async (e) => {
        // comment this out after testing
        e.preventDefault(); // this makes it so that the page doesnt refresh and clear the inputs

        /* cleaning up the data */
        const cleanedKids = kids.map(kid => ({
            ...kid,
            firstName: kid.firstName.trim(),
            lastName: kid.lastName.trim(),
            birthdate: kid.birthdate.trim(),
            allergies: kid.allergies.trim(),
        }));
        const cleanedParent = {
            firstName: pFirstname.trim(),
            lastName: pLastname.trim(),
            phone: pPhone.trim(),
            emergency: emergency.trim(),
        };



        {/* Checking if the parent exists using the phone number */ }
        const parentExists = parentsDB.some(
            (parent) => parent.phone.trim() === cleanedParent.phone
        );

        {/* If the parent exists check if there are any new kids */ }
        if (parentExists) {

            const existingParent = parentsDB.find(
                (p) => p.phone.trim() === cleanedParent.phone
            );

            if (!existingParent) {
                console.error("For whatever reason the parent was found but still has error?")
                alert("For whatever reason the parent was found but still has error?")
                return
            }

            const newKidsToAttach = cleanedKids.filter((kid) =>
                !parentsDB.some((parent) =>
                    parent.kids?.some?.((existingKid) =>
                        existingKid.firstName.trim().toLowerCase() === kid.firstName.toLowerCase() &&
                        existingKid.lastName.trim().toLowerCase() === kid.lastName.toLowerCase() &&
                        existingKid.birthdate.trim() === kid.birthdate
                    )
                )
            );

            try {
                if (newKidsToAttach.length > 0) {
                    // setPendingKids((prev) => [...prev, ...newKidsToAttach]);

                    const kidsWithId = await Promise.all(
                        newKidsToAttach.map(async kid => ({
                            ...kid,
                            id: await getNextKidId()
                        }))
                    );

                    const parentRef = doc(db, "parents", existingParent.id);

                    await updateDoc(parentRef,
                        {
                            kids: arrayUnion(...kidsWithId)
                        }
                    );

                    alert(`New kid(s) added under parent ${existingParent.firstName}`);

                }
                else {
                    alert(t("parentExistsError") + "\n" + t("kidExistsError"));
                    return;
                }
            } catch (err) {
                console.error(err)
            }

            // alert(`A new kid was added to the data base under ${cleanedParent.firstName}`)

        }
        else {
            {/* it should only get in here if there is a completely new parent and kid(s) */ }

            try {
                const kidsWithId = await Promise.all(
                    cleanedKids.map(async (kid) => ({
                        ...kid,
                        id: await getNextKidId()
                    }))
                );

                const parentRef = await addDoc(collection(db, 'parents'), {
                    ...cleanedParent,
                    kids: kidsWithId,
                    createdAt: new Date().toISOString()
                });

                alert(t("regComplete"))

                router.push("/checkIn/kids") // comment this back in after testing

            } catch (err) {
                console.error("Error saving to Firestore: ", err);
                alert("Error saving to database");
            }


        }

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
                <h2 className="parentInfoHeader parentRegH2">
                    {t("ParentInfoHeader")}
                </h2>

                {/* Parent inputs */}
                <div>{/* first name */}
                    <p className="parentRegP">{t("FirstNameTxt")} *</p>
                    <input
                        className="parentRegInput"
                        type="text"
                        required
                        onChange={(e) => setpfn(e.target.value)}
                    />
                </div>

                <div>{/* last name */}
                    <p className="parentRegP">{t("LastNameTxt")} *</p>
                    <input
                        className="parentRegInput"
                        type="text"
                        required
                        onChange={(e) => setpln(e.target.value)}
                    />
                </div>

                {/* Phone numbers will work differently */}
                <div>{/*  phone Number */}
                    <p className="parentRegP">{t("PhoneTxt")} *</p>
                    <input
                        className="parentRegInput"
                        type="tel"
                        pattern="[0-9]{10}"
                        placeholder="1234567890"
                        required
                        style={{ textAlign: "center" }}
                        onChange={(e) => setP(e.target.value)}
                    />

                </div>

                <div> {/* emergency contact */}
                    <p className="parentRegP">{t("EmergencyContactTxt")}</p>
                    <input
                        className="parentRegInput"
                        style={{ textAlign: "center" }}
                        type="tel"
                        pattern="[0-9]{10}"
                        onChange={(e) => setE(e.target.value)}
                        placeholder="0123456789"
                    />
                </div>

                {/* kid info */}
                <h2 className="kidInfoHeader parentRegH2">{t("KidInfoHeader")}</h2>

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
                                className="parentRegInput"
                                type="text"
                                required
                                value={kid.firstName}
                                onChange={(e) => handleKidChange(index, "firstName", e.target.value)}
                            />
                        </div>

                        {/* Kid LastName */}
                        <div>
                            <p className="parentRegP">{t("LastNameTxt")} *</p>
                            <input
                                className="parentRegInput"
                                type="text"
                                required
                                value={kid.lastName}
                                onChange={
                                    (e) => handleKidChange(index, "lastName", e.target.value)
                                }
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
                            {/* year */}
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
                                className="parentRegInput"
                                type="text"
                                value={kid.allergies}
                                onChange={(e) => handleKidChange(index, "allergies", e.target.value)}
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
    ) // return the html code
} // checkinpage