/********************************************
 * root/page.js
*********************************************/
'use client';
import AuthButton from './lib/AuthButton';
import './globals.css'

export default function Home() {
  return (
    <div className="rootLayout">
      <div style={{ textAlign: "right", marginRight: '10px' }}>
        <AuthButton />
      </div>
      <h1 style={{ textAlign: "center" }}>
        Hello!
      </h1>
    </div >
  );
}
