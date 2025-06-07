/********************************************
 * root/page.js 
*********************************************/


// 'use client';

// import { useEffect } from 'react';
// import { db } from './lib/firebase';
// import { collection, addDoc, getDocs } from 'firebase/firestore';

// export default function TestFirestore() {
//   useEffect(() => {
//     const test = async () => {
//       const ref = collection(db, 'testCollection');

//       // Add a document
//       await addDoc(ref, { name: 'Test User', timestamp: Date.now() });

//       // Get all documents
//       const snapshot = await getDocs(ref);
//       snapshot.forEach(doc => {
//         console.log(doc.id, doc.data());
//       });
//     };

//     test();
//   }, []);

//   return <div>Check the console for Firestore test</div>;
// }














export default function Home() {
  return (
    <div className="myPadding">

      <h1>Root Page</h1>

    </div>
  );
}
