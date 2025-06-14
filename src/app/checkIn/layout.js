/********************************************
 * kids/layout.js
*********************************************/

export const metadata = {
    title: 'Check in',
    description: 'This is the check in page.'
};

export default function chickenLayout({ children }) {
    return (
        <div className="chickenMainDiv">
            {children}
        </div>
    );
}

// background-color: rgb(251, 255, 178);