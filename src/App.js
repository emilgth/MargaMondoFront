import React, {useEffect, useState} from "react"
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {FlightsTable, FlightsTableReturn} from "./FlightsTable";
import {BrowserRouter as Router, NavLink, Route, Switch} from "react-router-dom";
import {FlightSearch, FlightSearchReturn} from "./FlightSearch";
import facade from "./apiFacade";
import {Redirection} from "./Redirection";
import Logo from "./purple.svg"
import Margamondo from "./margamond.png"

import {
    handleAirlinesCheckbox,
    renderAirlinesCheckboxes,
    handleFlightClassCheckbox,
    RenderClassesCheckboxes
} from "./checkboxFacade";

//Welcome to the jungle
const Welcome = () => {
    return (
    	<div>
			<img src={Margamondo} className="margmond"/>
		</div>
	);
};

const Header = () => {
    return (
        <div>
			<nav className="navbar navbar-expand-sm bg-orange	 navbar-dark">
				<a className="navbar-brand" href="http://localhost:3000/">
					<img src={Logo} className="logo"/>
				</a>
			</nav>
        </div>
    )
};


function App() {
    const [returnChecked, setReturnChecked] = useState("off");
    const [originalFlights, setOriginalFlights] = useState([]); //this is the list of flights retrieved by the fetch function, it shouldn't be altered by anything, but the fetch function
    const [originalReturnFlights, setOriginalReturnFlights] = useState([]);
    const [flights, setFlights] = useState(originalFlights); //this is the list of flights used to actually display the list, and the one altered by various functions
    const [returnFlights, setReturnFlights] = useState([]);
    const [airlines, setAirlines] = useState([]); //this is used to display the checkboxes
    const [airlinesUnchecked, setAirlinesUnchecked] = useState([]);
    const [flightClasses, setFlightClasses] = useState([]);
    const [flightClassesUnchecked, setFlightClassesUnchecked] = useState([]);

    useEffect(() => {
        facade.fetchAllFlights().then(data => {
            for (let flight of data[1]) {
                flight.id += 1000
            }
            let combinedArrays = [...data[0], ...data[1]];
            let flightsFormattedTime = combinedArrays.map(flight => {
                flight.flightDuration = msToTime(flight.flightDuration);
                if (flight.flightClass === undefined) {
                    flight.flightClass = "Unknown";
                }
                return flight;
            });
            setOriginalFlights(flightsFormattedTime);
            setFlights(flightsFormattedTime);

            //pull out the distinct airlines from the list of flights
            let allAirlines = new Set();
            let allFlightClasses = new Set();
            combinedArrays.forEach(data => {
                allAirlines.add(data.airline);
                allFlightClasses.add(data.flightClass);
            });

            //adds a 'checked' property to the list of airlines
            allAirlines = [...allAirlines];
            allFlightClasses = [...allFlightClasses];
            allAirlines = allAirlines.map(airline => {
                return {airline: airline, checked: true}
            });
            allFlightClasses = allFlightClasses.map(flightClass => {
                return {flightClass: flightClass, checked: true}
            });

            setAirlines(allAirlines);
            setFlightClasses(allFlightClasses);
        });

    }, []);

    function msToTime(duration) {
        let seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        //todo change to 1 hours and 343 minutes
        return hours + ":" + minutes + ":" + seconds;
    }

    const handleCheckbox = handleAirlinesCheckbox(airlines, setAirlines, setAirlinesUnchecked, originalFlights, setFlights, originalReturnFlights, setReturnFlights, flightClassesUnchecked);
    const handleClassCheckbox = handleFlightClassCheckbox(flightClasses, setFlightClasses, setFlightClassesUnchecked, originalFlights, setFlights, originalReturnFlights, setReturnFlights, airlinesUnchecked);

    return (
        <div>
            <Router>
                <Header/>
                {/*todo refactor into separate component */}
				<div className={"bg-white container rounded mt-2 p-2"}>
                {renderAirlinesCheckboxes(airlines, handleCheckbox, setFlights, originalFlights, setReturnFlights, originalReturnFlights, setAirlines)}
                <RenderClassesCheckboxes flightClasses={flightClasses} handleClassCheckbox={handleClassCheckbox}
                                         setFlights={setFlights} originalFlights={originalFlights}
                                         setReturnFlights={setReturnFlights}
                                         originalReturnFlights={originalReturnFlights}
                                         setFlightClasses={setFlightClasses}/>
				</div>
                <Switch>
                    <Route exact path={"/"}>
						<div className={"container mt-5 bg-white rounded p-2"}>
                        <label>
                            <input
                                type={"checkbox"}
                                onChange={() => returnChecked === "off"
                                    ? setReturnChecked("on") : setReturnChecked("off")}/>Return
                            ticket
                        </label>
                        {returnChecked === "on"
                            ? <FlightSearchReturn setFlights={setFlights} setOriginalFlights={setOriginalFlights}
                                                  setReturnFlights={setReturnFlights}
                                                  setOriginalReturnFlights={setOriginalReturnFlights}/>
                            : <FlightSearch setFlights={setFlights} setOriginalFlights={setOriginalFlights}/>}
                        {returnChecked === "on"
                            ? <FlightsTableReturn flights={flights} returnFlights={returnFlights}/>
                            : <FlightsTable flights={flights}/>}
						</div>
                    </Route>
                    <Route path="/redirecting">
                        <Redirection/>
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
