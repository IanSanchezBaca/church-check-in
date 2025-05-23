/* root page
 * import Image from "next/image";
*/
import Link from "next/link"; // use this as using the regular link tag breaks



export default function Home() {
  return (
    <div>
    
      <h1>Root Page</h1> 
      <br></br>

      <Link href="/temp">link to tempPage</Link>
    
    </div>
);}
