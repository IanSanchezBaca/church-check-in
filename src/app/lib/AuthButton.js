'use client';
import React, { useEffect, useState } from 'react';
import { auth } from '@/app/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function AuthButton() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const handleAuthClick = async () => {
        if (user) {
            await signOut(auth);
            router.push('/');
        } else {
            router.push('/login'); // your sign-in page route
        }
    };

    return React.createElement('button', {
        onClick: handleAuthClick,
        className: 'auth-button',
    }, user ? 'Sign Out' : 'Sign In');
}
