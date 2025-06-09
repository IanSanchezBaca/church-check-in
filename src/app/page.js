/********************************************
 * root/page.js
*********************************************/
'use client';
import AuthButton from './lib/AuthButton';
import './globals.css'

export default function Home() {
  return (
    <div>
      <div style={{ textAlign: "right", marginRight: '10px' }}>
        <AuthButton />
      </div>
      <h1 style={{ textAlign: "center" }}>Root Page</h1>
      <div></div>
    </div >
  );
}
