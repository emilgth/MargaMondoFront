import React, {useEffect, useState} from "react"
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {NewFlightsTable, NewFlightsTableReturn, Pagination} from "./FlightsTable";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {FlightSearch, FlightSearchReturn} from "./FlightSearch";
import {LogButton, LogTable, SearchLogTable} from "./FlightLogs";
import facade from "./apiFacade";
import './App.css';
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
import {PriceSlider, TimeSlider} from "./PriceSlider";
import {CopenhagenBanner, LondonBanner, ParisBanner} from "./banners";

//Welcome to the jungle
const Welcome = () => {
    return (
        <div className={"container-fluid"}>
            <div className={"bg-marge shadow-lg mt-5 row align-items-center"}>
                <img src={banner} style={{width: "20%"}} alt={""}/>
                <img src={facebook} className={"mr-2 img-fluid"} style={{height: 50}} alt={""}/>
                <img src={twitter} className={"mr-2"} style={{height: 50}} alt=""/>
                <img src={instagram} style={{height: 50}} alt=""/>
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
    const [numberOfAdults, setNumberOfAdults] = useState(1);
    const [numberOfChildren, setNumberOfChildren] = useState(0);
    const [log, setLog] = useState(null);
    const [searchLog, setSearchLog] = useState(null);
    const [startIndex, setStartIndex] = useState(0);

    useEffect(() => {
        facade.fetchAllFlights().then(data => {
            for (let flight of data[1]) {
                flight.id += 1000
            }
            let combinedArrays = [...data[0], ...data[1]];
            let allAirlines = new Set();
            let allFlightClasses = new Set();
            let flightsFormattedTime = combinedArrays.map(flight => {
                flight.arrivalTime = new Date(Date.parse(flight.departureTime) + flight.flightDuration).toString();
                flight.flightDurationMS = flight.flightDuration;
                flight.flightDuration = msToTime(flight.flightDuration);
                flight.departureTime = new Date(Date.parse(flight.departureTime)).toString();
                flight.departureTimeMS = Date.parse(flight.departureTime);
                flight.arrivalTimeMS = Date.parse(flight.departureTime) + flight.flightDurationMS;
                if (flight.flightClass === undefined) {
                    flight.flightClass = "Unknown";
                }
                allAirlines.add(flight.airline);
                allFlightClasses.add(flight.flightClass);
                return flight;

            });
            flightsFormattedTime.sort(function (a, b) {
                return a.price - b.price;
            });
            setOriginalFlights(flightsFormattedTime);
            setFlights(flightsFormattedTime);

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
            let returnPrice = ((selectedFlight.price + selectedReturnFlight.price) * numberOfAdults) + ((selectedFlight.price + selectedReturnFlight.price) / 2 * numberOfChildren);
            return (
                <div className={"bg-marge rounded shadow-lg p-5 mb-3"}>
                    <div className={"row"}>
                        <h4><strong>Your ticket</strong></h4>
                        <div className={"row"}>
                            <div className={"col"}>
                                <p>{selectedFlight.airline} {selectedFlight.departureTime.slice(0, 21)}
                                </p></div>
                            <p className={"text-right"}><strong>Flight duration:</strong> {selectedFlight.duration}</p>
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col"}>
                            <p>
                                <strong>Arrival:</strong>{selectedFlight.airline} {selectedFlight.arrivalTime.slice(0, 21)}
                            </p>
                        </div>
                        <div className={"col"}>
                            <em>{selectedFlight.flightClass}</em>
                        </div>
                        <div className={"col"}>
                            <h4 className={"text-right"}><strong>Price:</strong> ${returnPrice},-</h4>
                        </div>
                    </div>
                    <div className={"col"}>
                        <button className={"btn-lg btn-success float-right"}
                                onClick={() => {
                                    facade.logFlights([{
                                        ...selectedFlight,
                                        numberOfAdults,
                                        numberOfChildren
                                    }, {
                                        ...selectedReturnFlight,
                                        numberOfAdults,
                                        numberOfChildren
                                    }]).then(data => console.log(data))
                                }}>
                            Book
                        </button>
                    </div>
                </div>
            )
        }
        if (selectedFlight && !selectedReturnFlight) {
            let singlePrice = (selectedFlight.price * numberOfAdults) + (selectedFlight.price / 2 * numberOfChildren);
            return (
                <div className={"bg-marge rounded shadow-lg mb-3 container-fluid"}>
                    <div className={"row"}>
                        <div className={"col-8 p-4"}>
                            <div className={"row"}>
                                <div className={"col"}>
                                    <strong>{selectedFlight.departureTime.slice(16, 21)} - {selectedFlight.arrivalTime.slice(16, 21)}</strong>
                                </div>
                                <div className={"col"}>
                                    <strong className={"float-right"}>{selectedFlight.flightDuration}</strong>
                                </div>
                            </div>
                            <div className={"row"}>
                                <div className={"col"}>
                                    {selectedFlight.airline}
                                </div>
                                <div className={"col"}>
                                    <p className={"float-right"}>{selectedFlight.departureAirportCode} - {selectedFlight.arrivalAirportCode}</p>
                                </div>
                            </div>
                        </div>
                        <div className={"col-4 pr-4 pt-4 pb-2 rounded-right"} style={{backgroundColor: "grey"}}>
                            <div className={"row pl-2"}>
                                <div className={"col"}>
                                    <div className={"row"}><p>Adults: {numberOfAdults}</p></div>
                                    <div className={"row"}><p>{numberOfChildren > 0 ? numberOfChildren : ""}</p></div>
                                    <div className={"row"}><h3><strong>${singlePrice}</strong></h3></div>
                                    <div className={"row"}>
                                        <button className={"btn btn-lg btn-block btn-success"}
                                                onClick={() => {
                                                    facade.logFlights([{
                                                        ...selectedFlight,
                                                        numberOfAdults,
                                                        numberOfChildren
                                                    }])
                                                }}>
                                            Book
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                // {selectedFlight.departure    AirportCode}->{selectedFlight.arrivalAirportCode}
            )
        } else return null
    };

    function sortByPrice() {
        let newFlights = [...originalFlights];
        newFlights.sort(function (a, b) {
            return a.price - b.price;
        });
        setFlights(newFlights);
    }

    function sortByDepartureTime() {
        let newFlights = [...originalFlights];
        newFlights.sort(function (a, b) {
            return a.departureTimeMS - b.departureTimeMS;
        });
        setFlights(newFlights);
    }

    function sorByFlightDuration() {
        let newFlights = [...originalFlights];
        newFlights.sort(function (a, b) {
            return a.flightDurationMS - b.flightDurationMS;
        });
        setFlights(newFlights);
    }

    return (
        <div className={"bg-spa"}>
            <Router>
                <Header/>
                <Switch>
                    <Route exact path={"/"}>
                        <div className={"mt-5 p-2"}>
                            <div className={"row"}>
                                <div className={"col-2"}>
                                    <div className={"bg-marge shadow-lg container rounded p-2"}>
                                        <h5><strong>Airlines</strong></h5>
                                        {renderAirlinesCheckboxes(airlines, handleCheckbox, setFlights, originalFlights, setReturnFlights, originalReturnFlights, setAirlines)}

                                    </div>
                                    <div className={"bg-marge shadow-lg container rounded mt-3 p-2"}>
                                        <h5><strong>Classes</strong></h5>
                                        <RenderClassesCheckboxes flightClasses={flightClasses}
                                                                 handleClassCheckbox={handleClassCheckbox}
                                                                 setFlights={setFlights}
                                                                 originalFlights={originalFlights}
                                                                 setReturnFlights={setReturnFlights}
                                                                 originalReturnFlights={originalReturnFlights}
                                                                 setFlightClasses={setFlightClasses}/>
                                    </div>
                                    <div className={"bg-marge shadow-lg container rounded mt-3 p-2"}>
                                        <h5><strong>Price and time</strong></h5>
                                        <PriceSlider setFlights={setFlights} originalFlights={originalFlights}/>
                                        <TimeSlider originalFlights={originalFlights} setFlights={setFlights}/>
                                    </div>

                                </div>
                                <div className={"col-8"}>
                                    <div className={"container-fluid mb-3"}><CopenhagenBanner/></div>
                                    <div className={"container-fluid"}>
                                        <SelectedFlightsRenderer/>
                                        <LogButton setLog={setLog} setSearchLog={setSearchLog}/>
                                        <LogTable log={log} searchLog={searchLog}/>
                                        <SearchLogTable searchLog={searchLog}/>
                                        <div className={"bg-marge p-2 rounded shadow-lg mb-3"}>
                                            <div>
                                                <div className={"form-inline mb-1"}>
                                                    <input className={"form-check-input"}
                                                           type={"checkbox"}
                                                           onChange={() => returnChecked === "off"
                                                               ?
                                                               setReturnChecked("on")
                                                               :
                                                               setReturnChecked("off")}/>
                                                    <label className={"form-check-label"}>Return ticket</label>
                                                    <input className={"form-control-sm rounded ml-5 mr-1"}
                                                           id={"numberOfAdultsInput"}
                                                           type={"number"}
                                                           placeholder={numberOfAdults}
                                                           onChange={() => setNumberOfAdults(document.getElementById("numberOfAdultsInput").value)}/>
                                                    Adults
                                                    <input className={"form-control-sm rounded ml-5 mr-1"}
                                                           id={"numberOfChildrenInput"}
                                                           type={"number"}
                                                           placeholder={numberOfChildren}
                                                           onChange={() => setNumberOfChildren(document.getElementById("numberOfChildrenInput").value)}/>
                                                    Children
                                                </div>
                                            </div>
                                            {returnChecked === "on"
                                                ?
                                                <FlightSearchReturn setFlights={setFlights}
                                                                    setOriginalFlights={setOriginalFlights}
                                                                    setReturnFlights={setReturnFlights}
                                                                    setOriginalReturnFlights={setOriginalReturnFlights}
                                                                    setLog={setLog}/>
                                                :
                                                <FlightSearch setFlights={setFlights}
                                                              setOriginalFlights={setOriginalFlights}/>}
                                        </div>
                                        <div className={"input-group form-inline mb-3 pl-0"}>
                                            <div className={"input-group-prepend"}>
                                                <button onClick={sortByPrice} className={"btn btn-success btn-sm"}>Sort
                                                    by
                                                    price
                                                </button>
                                                <button onClick={sorByFlightDuration}
                                                        className={"btn btn-success btn-sm"}>Sort by flight duration
                                                </button>
                                            </div>
                                            <div className={"input-group-append"}>
                                                <button onClick={sortByDepartureTime}
                                                        className={"btn btn-success btn-sm"}>Sort by departure time
                                                </button>
                                            </div>
                                        </div>
                                        {returnChecked === "on" //The new table
                                            ?
                                            <div>
                                                <div style={{
                                                    display: "inline-block",
                                                    verticalAlign: "top",
                                                    marginRight: "2%",
                                                    width: "49%",
                                                    maxWidth: "49%"
                                                }}>
                                                    <h4 className={"bg-marge p-2 rounded shadow-lg"}>Flights
                                                        out</h4>
                                                    <NewFlightsTable flights={flights}
                                                                     setSelectedFlight={setSelectedFlight}
                                                                     startIndex={startIndex}/>
                                                </div>
                                                <div style={{
                                                    display: "inline-block",
                                                    verticalAlign: "top",
                                                    width: "49%",
                                                    maxWidth: "49%"
                                                }}>
                                                    <h4 className={"bg-marge p-2 rounded shadow-lg"}>Return
                                                        flights</h4>
                                                    <NewFlightsTableReturn returnFlights={returnFlights}
                                                                           setSelectedReturnFlights={setSelectedReturnFlight}
                                                                           startIndex={startIndex}/>
                                                </div>
                                            </div>
                                            :
                                            <NewFlightsTable flights={flights}
                                                             setSelectedFlight={setSelectedFlight}
                                                             startIndex={startIndex}/>
                                        }
                                        <Pagination startIndex={startIndex} setStartIndex={setStartIndex}/>
                                    </div>
                                </div>
                                <div className={"col-2"}>
                                    <LondonBanner/>
                                    <ParisBanner/>
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
