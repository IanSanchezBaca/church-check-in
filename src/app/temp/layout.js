/* layout for temp 
 * This is the temp layout and i will be doing all my tests on this
 * This 
*/
import "./tempCSS.css";
// app/layout.js

export const metadata = { // This is the default function
  title: 'Temp Page',
  description: 'My test page.',
};

export default function TempLayout({ children }) {
  return (
    <html lang="en">
      <body>
      
      <h>Temp Header!</h>

      <main>{children}</main>  
              
      </body>
    </html>
);}
