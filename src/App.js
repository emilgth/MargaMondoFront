import React, {useEffect, useState} from "react"
import {FlightsTable, FlightsTableReturn} from "./FlightsTable";
import {BrowserRouter as Router, NavLink, Route, Switch} from "react-router-dom";
import {FlightSearch, FlightSearchReturn} from "./FlightSearch";
import facade from "./apiFacade";
import {Redirection} from "./Redirection";
import {handleAirlinesCheckbox, renderAirlinesCheckboxes, handleFlightClassCheckbox, RenderClassesCheckboxes} from "./checkboxFacade";

//Welcome to the jungle
const Welcome = () => {
    return "Welcome to MargaMondo";
};

const Header = () => {
    return (
        <div><NavLink to={"/"}>Home</NavLink>
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
                return flight;
            });
            setOriginalFlights(flightsFormattedTime);
            setFlights(flightsFormattedTime);

            //pull out the distinct airlines from the list of flights
            const distinct = (value, index, self) => {
                return self.indexOf(value) === index;
            };
            const allAirlines = [];
            const allFlightClasses = [];
            combinedArrays.map(data => {
                allAirlines.push(data.airline);
                if (data.flightClass !== undefined) {
                    allFlightClasses.push(data.flightClass);
                }
            });

            const airlinesAlmost = allAirlines.filter(distinct);
            const flightClassesAlmost = allFlightClasses.filter(distinct);

            //adds a 'checked' property to the list of airlines
            const airlines = airlinesAlmost.map(airline => {
                return {airline: airline, checked: true}
            });
            const flightClasses = flightClassesAlmost.map(flightClass => {
                return {flightClass: flightClass, checked: true}
            });
            setAirlines(airlines);
            setFlightClasses(flightClasses);
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
                {renderAirlinesCheckboxes(airlines, handleCheckbox, setFlights, originalFlights, setReturnFlights, originalReturnFlights, setAirlines)}
                <RenderClassesCheckboxes flightClasses={flightClasses} handleClassCheckbox={handleClassCheckbox} setFlights={setFlights} originalFlights={originalFlights} setReturnFlights={setReturnFlights} originalReturnFlights={originalReturnFlights} setFlightClasses={setFlightClasses} />
                <Switch>
                    <Route exact path={"/"}>
                        <Welcome/>
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
