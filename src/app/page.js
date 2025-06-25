/********************************************
 * root/page.js
*********************************************/
'use client';
// import AuthButton from './lib/AuthButton';
// import AdminButton from './lib/adminButton';
import './globals.css'
import Link from 'next/link';



export default function Home() {
  return (
    <div className="rootLayout">

      <h1 style={{ textAlign: "center" }}>
        Hello!
      </h1>
      <Link href="/checkIn/kids">
        <button style={{ marginLeft: '1rem', padding: "1rem" }}>
          Sign in kid
        </button>
      </Link>

    </div >
  );
}
