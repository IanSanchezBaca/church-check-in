/********************************************
 * root/page.js
*********************************************/
'use client';
import AuthButton from './lib/AuthButton';
import AdminButton from './lib/adminButton';
import './globals.css'

export default function Home() {
  return (
    <div className="rootLayout">

      <h1 style={{ textAlign: "center" }}>
        Hello!
      </h1>

      <AdminButton />

    </div >
  );
}
