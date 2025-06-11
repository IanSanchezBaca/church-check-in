/********************************************
 * register/page.js 
*********************************************/
'use client'; // This has to be printed before everything else

import React, { useState } from 'react'; /// This is used to create react function
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/app/lib/firebase';
import { useRouter } from 'next/navigation';




export default function MainRegister() {
    const [showPassword, setShowPassword] = useState(false); // used for the button to show password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => { /// function that will be called when submit button is pressed
        e.preventDefault();

        if (!name || !email || !password) {
            alert('Please fill in all fields');
            return;
        }

        try {
            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store additional user info in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                name,
                email,
                role: 'user',
                isAdmin: false,
                createdAt: new Date().toISOString()
            });

            alert('Registration successful!');
            router.push('/'); // redirect to home or login
        }
        catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                alert('This email is already in use.');
            } else {
                alert('Registration failed.');
            }
        }
    };

    /* The html stuff */
    return React.createElement('div', { className: 'mainDivRegister' }, [
        React.createElement('h2', { key: 'mainRegHeading', className: 'mainRegH2' }, 'Register'),

        React.createElement('form', {
            onSubmit: handleSubmit,
            key: 'formKey',
            className: 'mainRegForm'
        },
            [

                /* Username */
                React.createElement('div', { key: 'usernameWrapper', className: 'mainRegWrapper' },
                    [
                        React.createElement('input', {
                            key: 'username',
                            type: 'text',
                            placeholder: 'Username',
                            value: name,
                            onChange: (e) => setName(e.target.value),
                            className: 'mainRegInput',
                        })
                    ]),

                /* Email */
                React.createElement('div', { key: 'emailWrapper', className: 'mainRegWrapper' }, [
                    React.createElement('input', {
                        key: 'email',
                        type: 'email',
                        placeholder: 'Email',
                        value: email,
                        onChange: (e) => setEmail(e.target.value),
                        className: 'mainRegInput',
                    })
                ]),

                /* Password */
                React.createElement('div', { key: 'passwordWrapper', className: 'mainRegWrapper' },
                    [
                        React.createElement('input', {
                            className: 'pswInput mainRegInput',
                            key: 'password',
                            type: showPassword ? 'text' : 'password',
                            placeholder: 'Password',
                            value: password,
                            onChange: (e) => setPassword(e.target.value),
                        }),
                    ]),

                /* Show password button */
                React.createElement('label', { key: 'showpass-label' }, [
                    React.createElement('input', {
                        className: 'checkBox mainRegInput',
                        key: 'showPswCheck',
                        type: 'checkbox',
                        checked: showPassword,
                        onChange: () => setShowPassword(!showPassword),
                    }),
                    'Show Password'
                ]),


                /* submit button */
                React.createElement('div', { key: 'submitBtnWrapper' }, [
                    React.createElement('button', {
                        key: 'submit',
                        type: 'submit',
                        className: 'mainRegisterSubmit'
                    }, 'Register'),
                ])

            ])
    ]);



} // export default function mainRegister