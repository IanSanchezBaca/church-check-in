/********************************************
 * root/page.js
*********************************************/
'use client';
import AuthButton from './lib/AuthButton';
import './globals.css'

export default function Home() {
  return (
    <div className="rootLayout">
      <div style={{ textAlign: "right" }}>
        {/* This might be the reason that it breaks */}
        <AuthButton />
      </div>
      <h1 style={{ textAlign: "center" }}>
        Hello!
      </h1>
    </div >
  );
}
