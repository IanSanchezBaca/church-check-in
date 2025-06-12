/********************************************
 * Login/page.js 
*********************************************/
'use client'

import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/app/lib/firebase'
import { useRouter } from 'next/navigation'


export default function SignInPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await signInWithEmailAndPassword(auth, email, password)
            router.push('/') // Redirect to admin dashboard
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="mainDivlogin">
            <h1 className="loginHead1">Log In</h1>
            <div className="bodyDiv">
                <form className='mainLoginForm' onSubmit={handleSubmit}>
                    <div>
                        <label className='mainLoginLabel'>Email</label>
                        <input
                            className='mainLoginInput'
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className='mainLoginLabel'>Password</label>
                        <input
                            className='mainLoginInput'
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div className='spec'>
                        <button className='mainLoginSubmit' type="submit">
                            Log In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
















// 'use client';
// import React, { useState } from 'react'; /// This is used to create react function
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { collection, addDoc } from 'firebase/firestore';
// import { auth, db } from '@/app/lib/firebase';
// import { useRouter } from 'next/navigation';


// export default function MainLogin() {


//     return React.createElement('div', {}, [
//         React.createElement('h2', { key: 'headingkey' }, 'Login'),




//     ]); // return

// } // MainLogin