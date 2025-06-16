/********************************************
 * kids/register/page.js 
*********************************************/
//// This tells Next.js that the component runs in the browser and can use state, events, etc.
'use client';

import "./reg.css"
import React, { useState, useContext } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getNextKidId } from "@/app/lib/firebaseUtils";
import { useRouter } from 'next/navigation'

import { EagleKidsPreloadContext } from '@/context/EagleKidsPreload';



export default function CheckinPage() {

    const {
        // isAdmin,
        // userData,
        // day, month, year, hour, min, currDate,
        // AttendanceDB,
        // attendanceIsLoading,
        parentsDB,
        // parentsDBIsLoading,
        // updatePreloadedAttendance,
    } = useContext(EagleKidsPreloadContext);


    /* State Hooks
     * parent stores first name, last name, phone, emergency contact.
     * kids is an array of kid objects (one or more). 
    **/
    const [parent, setParent] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        emergency: ''
    });

    const [kids, setKids] = useState([{
        firstName: '',
        lastName: '',
        birthdate: '',
        allergies: ''
    }]);

    /* Event Handlers
     * handleParentChange(field, value)
     ** Updates the parent state when an input is typed in.

     * handleKidChange(index, field, value)
     ** Updates a specific kid's info at a given position in the list.

     * addAnotherKid()
     ** Adds an empty new kid object to the kids array.
    **/
    const handleParentChange = (field, value) => {
        setParent({ ...parent, [field]: value });
    };

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
        e.preventDefault();

        // validate required parent fields
        if (!parent.firstName || !parent.lastName || !parent.phone) {
            alert('Please fill in all required parent fields.');
            return;
        }
        // validate kid fields
        for (let kid of kids) {
            if (!kid.firstName || !kid.lastName || !kid.birthdate) {
                alert('Please fill in all required kid fields.');
                return;
            }
        }

        // Add kid IDs
        const kidsWithId = await Promise.all(
            kids.map(async (kid) => ({
                ...kid,
                id: await getNextKidId()
            }
            ))
        );

        /*Saves the parent and all kids together into Firestore as one document*/
        try {
            const parentRef = await addDoc(collection(db, 'parents'), {
                ...parent,
                kids: kidsWithId,
                createdAt: new Date().toISOString()
            });

            alert('Reg complete!');

            useRouter().push("/checkIn/kids");

            // Reset form
            setParent({ firstName: '', lastName: '', phone: '', emergency: '' });
            setKids([{ firstName: '', lastName: '', birthdate: '', allergies: '' }]);
        } catch (err) {
            console.error(err);
            alert('Error saving to database.');
        }
    }; // handle submit

    return React.createElement('form', { onSubmit: handleSubmit },
        [React.createElement('h2', { key: 'heading-parent' }, 'Parent Info')].concat(
            ['firstName', 'lastName', 'phone', 'emergency'].map((field) =>
                React.createElement('input', {
                    key: `parent-${field}`,
                    placeholder: field.charAt(0).toUpperCase() + field.slice(1) + (field !== 'emergency' ? ' *' : ''),
                    value: parent[field],
                    onChange: e => handleParentChange(field, e.target.value)
                })
            ),

            [React.createElement('h2', { key: 'heading-kids' }, 'Kid(s) Info')],
            kids.map((kid, index) =>
                React.createElement('div', { key: `kid-${index}`, className: 'kidDiv' }, [
                    React.createElement('p', { key: `label-${index}` }, `Kid #${index + 1}`),
                    ...['firstName', 'lastName', 'birthdate', 'allergies'].map(field =>
                        React.createElement('input', {
                            key: `kid-${index}-${field}`,
                            placeholder: field.charAt(0).toUpperCase() + field.slice(1) + (field !== 'allergies' ? ' *' : ''),
                            value: kid[field],
                            onChange: e => handleKidChange(index, field, e.target.value)
                        })
                    ),
                    index > 0 && /* adds a delete button for kid 2 and greater */
                    React.createElement('div', { className: 'delete-button-container', key: `delete-wrap-${index}` }, [
                        React.createElement('button', {
                            key: `delete-${index}`,
                            type: 'button',
                            onClick: () => {
                                const updatedKids = [...kids];
                                updatedKids.splice(index, 1);
                                setKids(updatedKids);
                            },
                            className: 'delete-button'
                        }, 'Delete Kid')
                    ])
                ])
            ),

            [
                React.createElement('button', {
                    type: 'button',
                    key: 'add-kid',
                    onClick: addAnotherKid,
                    className: 'kidAddBtn',
                }, 'Add Another Kid'),

                React.createElement(
                    'div',
                    {
                        key: `submit-button-container`,
                        className: 'submitButtonContainer'
                    },
                    [
                        React.createElement('button', {
                            type: 'submit',
                            key: 'submit',
                            className: 'submitButton'
                        }, 'Submit')
                    ]
                )
            ]
        )
    ); // return
} // checkinpage



