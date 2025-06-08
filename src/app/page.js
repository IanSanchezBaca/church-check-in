/********************************************
 * root/page.js
*********************************************/
'use client';
import AuthButton from './lib/AuthButton';

export default function Home() {
  return (
    <div>
      <h1 style={{ backgroundColor: "aqua", textAlign: "center" }}>Root Page</h1>
      <div style={{ textAlign: "right", marginRight: '10px' }}>
        <AuthButton />
      </div>
    </div >
  );
}
