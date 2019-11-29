import React, {useEffect, useState} from "react"
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {FlightsTable, FlightsTableReturn, NewFlightsTable} from "./FlightsTable";
import {BrowserRouter as Router, NavLink, Route, Switch} from "react-router-dom";
import {FlightSearch, FlightSearchReturn} from "./FlightSearch";
import facade from "./apiFacade";
import {Redirection} from "./Redirection";
import Logo from "./Images/purple.svg"
import banner from "./Images/output-onlinepngtools.png"
import facebook from "./Images/Facebook.PNG";
import twitter from "./Images/Twitter.PNG";
import instagram from "./Images/Instagram.png";


import {
    handleAirlinesCheckbox,
    handleFlightClassCheckbox,
    renderAirlinesCheckboxes,
    RenderClassesCheckboxes
} from "./checkboxFacade";

//Welcome to the jungle
const Welcome = () => {
    return (
        <div className={"container"}>
            <div className={"bg-marge shadow-lg rounded-top mt-5 row align-items-center"}>

                <img src={banner} style={{width: "20%"}} alt={""}/>
                <div style={{marginLeft: "64%"}}>
                    <img src={facebook} className={"mr-2 img-fluid"} style={{height: 50}} alt={""}/>
                    <img src={twitter} className={"mr-2"} style={{height: 50}} alt=""/>
                    <img src={instagram} style={{height: 50}} alt=""/></div>
            </div>
        </div>
    );
};

const Header = () => {
    return (
        <div>
            <nav className="navbar navbar-expand-sm bg-orange shadow-lg navbar-dark">
                <a className="navbar-brand" href="http://localhost:3000/">
                    <img src={Logo} className="logo" alt={"MargaMondo"}/>
                </a>
            </nav>
        </div>
    )
};


function App() {
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [selectedReturnFlight, setSelectedReturnFlight] = useState(null);
    const [returnChecked, setReturnChecked] = useState("off");
    const [originalFlights, setOriginalFlights] = useState([]); //this is the list of flights retrieved by the fetch function, it shouldn't be altered by anything, but the fetch function
    const [originalReturnFlights, setOriginalReturnFlights] = useState([]);
    const [flights, setFlights] = useState(originalFlights); //this is the list of flights used to actually display the list, and the one altered by various functions
    const [returnFlights, setReturnFlights] = useState([]);
    const [airlines, setAirlines] = useState([]); //this is used to display the checkboxes
    const [airlinesUnchecked, setAirlinesUnchecked] = useState([]);
    const [flightClasses, setFlightClasses] = useState([]);
    const [flightClassesUnchecked, setFlightClassesUnchecked] = useState([]);
    const [numberOfPassengers, setNumberOfPassengers] = useState(1);

    useEffect(() => {
        facade.fetchAllFlights().then(data => {
            for (let flight of data[1]) {
                flight.id += 1000
            }
            let combinedArrays = [...data[0], ...data[1]];
            let flightsFormattedTime = combinedArrays.map(flight => {
                flight.arrivalTime = new Date(Date.parse(flight.departureTime) + flight.flightDuration).toString();
                flight.flightDuration = msToTime(flight.flightDuration);
                flight.departureTime = new Date(Date.parse(flight.departureTime)).toString();
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
    const SelectedFlightsRenderer = () => {
        if (selectedFlight && selectedReturnFlight) {
            let returnPrice = (selectedFlight.price + selectedReturnFlight.price) * numberOfPassengers;
            return (
                <div>
                    {flights.map(flight => {
                        return <div className={"container bg-marge rounded shadow-lg p-5 mb-3"}>
                            <div className={"row"}>
                                <div className={"col"}>
                                    <h4><strong>Your ticket</strong></h4>
                                </div>
                                <div className={"col"}>
                                    <p className={"text-right"}> {selectedFlight.airline} {selectedFlight.departureTime} {selectedFlight.duration} {selectedFlight.departureAirportCode}->{selectedFlight.arrivalAirportCode}</p>
                                </div>
                            </div>
                            <div className={"row"}>
                                <div className={"col"}><p><strong>Departure:</strong> {flight.departureTime.slice(0, 21)}</p></div>
                                <div className={"col"}>
                                    <p className={"text-right"}><strong>Flight duration:</strong> {flight.flightDuration.slice(0, 5)}</p>
                                </div>
                            </div>
                            <div className={"row"}>
                                <div className={"col"}><p><strong>Arrival:</strong></p></div>

                                <div className={"col"}>
                                    <h4 className={"text-right"}><strong>Price:</strong> ${flight.price},-</h4>
                                </div>
                            </div>
                            <div className={"row"}>
                                <div className={"col"}>
                                    <em>{flight.flightClass}</em>
                                </div>
                                <div className={"col"}>
                                    ${returnPrice},- <NavLink to="/redirecting">Redirect to booking</NavLink>
                                </div>

                            </div>


                        </div>;
                    })}
                </div>

                // <div>
                //     <h3>Your ticket</h3>
                //     <p>
                //         {selectedFlight.airline} {selectedFlight.departureTime} {selectedFlight.duration} {selectedFlight.departureAirportCode}->{selectedFlight.arrivalAirportCode}
                //     </p>
                //     <p>
                //         {selectedReturnFlight.airline} {selectedReturnFlight.departureTime} {selectedReturnFlight.duration} {selectedReturnFlight.departureAirportCode}->{selectedReturnFlight.arrivalAirportCode}
                //     </p>
                //     <p>
                //         ${returnPrice},- <NavLink to="/redirecting">Redirect to booking</NavLink>
                //     </p>
                // </div>
            )
        }
        if (selectedFlight && !selectedReturnFlight) {
            let singlePrice = selectedFlight.price * numberOfPassengers;
            return (
                <div>
                    {flights.map(flight => {
                        return <div className={"container bg-marge rounded shadow-lg p-5 mb-3"}>
                            <div className={"row"}>
                                <div className={"col"}>
                                    <h4><strong>Your ticket</strong></h4>
                                </div>
                                <div className={"col"}>
                                    <p className={"text-right"}> {selectedFlight.airline} {selectedFlight.departureTime} {selectedFlight.duration} {selectedFlight.departureAirportCode}->{selectedFlight.arrivalAirportCode}</p>
                                </div>
                            </div>
                            <div className={"row"}>
                                <div className={"col"}><p><strong>Departure:</strong> {flight.departureTime.slice(0, 21)}</p></div>
                                <div className={"col"}>
                                    <p className={"text-right"}><strong>Flight duration:</strong> {flight.flightDuration.slice(0, 5)}</p>
                                </div>
                            </div>
                            <div className={"row"}>
                                <div className={"col"}><p><strong>Arrival:</strong></p></div>

                                <div className={"col"}>
                                    <h4 className={"text-right"}><strong>Price:</strong> ${flight.price},-</h4>
                                </div>
                            </div>
                            <div className={"row"}>
                                <div className={"col"}>
                                    <em>{flight.flightClass}</em>
                                </div>
                                <div className={"col"}>
                                    ${singlePrice},- <NavLink to="/redirecting">Redirect to booking</NavLink>
                                </div>

                            </div>


                        </div>;
                    })}
                </div>

            )
        } else return null
    };
    return (
        <div className={"bg-spa"}>
            <Router>
                <Header/>

                {/*todo refactor into separate component */}

                <Switch>
                    <Route exact path={"/"}>
                        <div className={"mt-5 rounded p-2"}>
                            <div className={"row"}>
                                <div className={"col-2"}>
                                    <div className={"bg-marge shadow-lg container rounded p-2"}>
                                        {renderAirlinesCheckboxes(airlines, handleCheckbox, setFlights, originalFlights, setReturnFlights, originalReturnFlights, setAirlines)}

                                    </div>
                                    <div className={"bg-marge shadow-lg container rounded mt-3 p-2"}>

                                    <RenderClassesCheckboxes flightClasses={flightClasses} handleClassCheckbox={handleClassCheckbox}
                                                             setFlights={setFlights} originalFlights={originalFlights}
                                                             setReturnFlights={setReturnFlights}
                                                             originalReturnFlights={originalReturnFlights}
                                                             setFlightClasses={setFlightClasses}/>
                                        </div>
                                </div>
                                <div className={"col-10"}>
                                    <SelectedFlightsRenderer/>
                                    <div className={"container bg-marge p-2 rounded shadow-lg mb-3"}>

                                            <input className={"form-check-inline"}
                                            type={"checkbox"}
                                            onChange={() => returnChecked === "off"
                                                ? setReturnChecked("on") : setReturnChecked("off")}/>Return
                                            ticket
                                            <input className={"form-control-inline rounded ml-5 mr-1"}
                                                   id={"numberOfPassengersInput"}
                                                   type={"number"}
                                                   placeholder={1}
                                                   onChange={() => setNumberOfPassengers(document.getElementById("numberOfPassengersInput").value)}/>Number
                                            of passengers

                                    </div>
                                    <NewFlightsTable flights={flights}/>
                                    {returnChecked === "on"
                                        ?
                                        <FlightSearchReturn setFlights={setFlights}
                                                            setOriginalFlights={setOriginalFlights}
                                                            setReturnFlights={setReturnFlights}
                                                            setOriginalReturnFlights={setOriginalReturnFlights}/>
                                        :
                                        <FlightSearch setFlights={setFlights} setOriginalFlights={setOriginalFlights}/>}
                                    {returnChecked === "on"
                                        ? <FlightsTableReturn flights={flights} returnFlights={returnFlights}
                                                              setSelectedFlight={setSelectedFlight}
                                                              setSelectedReturnFlight={setSelectedReturnFlight}/>
                                        : <FlightsTable flights={flights} setSelectedFlight={setSelectedFlight}/>}
                                </div>
                            </div>
                        </div>
                    </Route>
                    <Route path="/redirecting">
                        <Redirection/>
                    </Route>
                </Switch>
            </Router>
            <Welcome/>
        </div>
    );

}

export default App;
