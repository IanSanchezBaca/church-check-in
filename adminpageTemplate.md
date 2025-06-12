```js
/********************************************
 * kids/admin/page.js 
 * This is a format for the stuff hopfully this should not be able to be accessed
 * this page is no longer needed just using it as a thing
*********************************************/

'use client'

import { useEffect, useState } from 'react'
import { auth, db } from '@/app/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { useRouter } from 'next/navigation'


export default function AdminPage() {
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const [data, setData] = useState([])
    const router = useRouter()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.push('/login')
                return
            }

            try {
                const userRef = doc(db, 'users', user.uid)
                const userDoc = await getDoc(userRef)

                if (userDoc.exists()) {
                    const userData = userDoc.data()
                    console.log('User Firestore data:', userData)

                    if (userData.isAdmin === true) {
                        setIsAdmin(true)

                        // fetch data (e.g., appointments)
                        const snapshot = await getDocs(collection(db, 'appointments'))
                        const result = []
                        snapshot.forEach(doc => result.push({ id: doc.id, ...doc.data() }))
                        setData(result)
                    } else {
                        console.log('User is not an admin. Redirecting.')
                        router.push('/')
                    }
                } else {
                    console.log('User document does not exist in Firestore.')
                    router.push('/')
                }
            } catch (err) {
                console.error('Error checking admin:', err)
                router.push('/')
            }

            setLoading(false)
        })

        return () => unsubscribe()
    }, [router])


    if (loading) return <div>Loading...</div>
    if (!isAdmin) return null // won't reach here, but for safety

    return (
        <div>
            <h1>Admin Dashboard</h1>
            {data.map((item) => (
                <div key={item.id}>
                    <pre>{JSON.stringify(item, null, 2)}</pre>
                </div>
            ))}
        </div>
    )
}

```