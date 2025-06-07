/********************************************
 * register/page.js 
*********************************************/
'use client';

import React, { useState } from 'react'; /// This is used to create react function
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '@/app/lib/firebase';
import { useRouter } from 'next/navigation';




export default function mainRegister() {
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
            await addDoc(collection(db, 'users'), {
                uid: user.uid,
                name,
                email,
                role: 'user',
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


    // fix this 
    return (
        <div>

            <h1 style={{ backgroundColor: "aqua", textAlign: "center" }}>register</h1>

        </div >
    );


} // export default function mainRegister