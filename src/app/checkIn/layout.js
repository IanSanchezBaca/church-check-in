/********************************************
 * kids/layout.js
*********************************************/
import "./chicken.css";

export const metadata = {
    title: 'Check in',
    description: 'I actually don\'t know what im doing'
};

export default function chickenLayout({ children }) {
    return (
        <div className="myPadding chickenLayout">
            {children}
        </div>
    );
}

// background-color: rgb(251, 255, 178);