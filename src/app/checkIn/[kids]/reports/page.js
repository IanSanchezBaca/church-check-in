/********************************************
 * This will be the reports page. 
 * Here you can get the attendance of the
*********************************************/

export default function ReportsPage() {

    // i need to include the use state
    // const [month1, setMonth1] = useState("");



    let test = true;




    return (
        <div className="ReportsPageMainDiv">
            <h2 className="ReportsH2">
                Date Range
            </h2>
            <form>
                <div
                    className="ReportsPageInputsContainer"
                >

                    <div className="ReportsPageLeft">
                        <input
                            className="ReportsPageInput"
                            placeholder="month"
                        />
                        <input
                            className="ReportsPageInput"
                            placeholder="day"
                        />
                        <input
                            className="ReportsPageInput"
                            placeholder="year"
                        />
                    </div>

                    <div className="ReportsPageMiddle">
                        <p>to</p>
                    </div>

                    <div className="ReportsPageRight">
                        <input
                            className="ReportsPageInput"
                            placeholder="month"
                        />
                        <input
                            className="ReportsPageInput"
                            placeholder="day"
                        />
                        <input
                            className="ReportsPageInput"
                            placeholder="year"
                        />
                    </div>
                </div>

                <div className="ReportsPageButtonContainer">
                    <button
                        className="ReportsPageSearchButton"
                    >
                        search
                    </button>
                </div>
            </form>

            {test && (
                <div className="ReportsPageResults">
                    Hello world!
                </div>
            )}



        </div>
    ) // return html code

} // ReportsPage