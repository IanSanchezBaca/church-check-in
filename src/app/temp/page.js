/* page for temp 
 * This is the temp page and i will be doing all my tests on this
*/
import Link from "next/link"; // use this to link 
import "./tempCSS.css"


export default function Temp() {return (
  // this is already surounded by a body tag
  <div>
    
    <h>tempPage</h><br></br>

    <Link href="/">link to root</Link>
  
  </div>
);}