/* root page
 * import Image from "next/image";
*/
import Link from "next/link"; // use this as using the regular link tag breaks



export default function Home() {
  return (
    <div>
    
    <h>root page</h> <br></br>
    
    <Link href="/temp">link to tempPage</Link>
    
    </div>
);}
