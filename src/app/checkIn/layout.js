/********************************************
 * kids/layout.js
*********************************************/
import "./chicken.css";

export const metadata = {
    title: 'Check in',
    description: 'This is the check in page.'
};

export default function chickenLayout({ children }) {
    return (
        <div className="myPadding chickenLayout">
            {children}
        </div>
    );
}

// background-color: rgb(251, 255, 178);