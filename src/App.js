import React, {useEffect, useState} from "react"
import {FlightsTable, FlightsTableReturn} from "./FlightsTable";
import {BrowserRouter as Router, NavLink, Route, Switch} from "react-router-dom";
import {FlightSearch, FlightSearchReturn} from "./FlightSearch";
import facade from "./apiFacade";
import {Redirection} from "./Redirection";

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

	useEffect(() => {
		facade.fetchAllFlights().then(data => {
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
			const allAirlines = combinedArrays.map(data => data.airline);
			const airlinesAlmost = allAirlines.filter(distinct);
			//adds a 'checked' property to the list of airlines
			const airlines = airlinesAlmost.map(airline => {
				return {airline: airline, checked: true}
			});
			setAirlines(airlines);
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

	const handleCheckbox = (event) => {
		const target = event.target;
		//sets the target airline's 'checked' property to the opposite
		let alteredAirlines = airlines.map(airline => {
			if (target.name === airline.airline) {
				return {airline: airline.airline, checked: !!target.checked};
			} else {
				return airline;
			}
		});
		setAirlines(alteredAirlines);

		//returns a list of airlines to be filtered out of the flight list
		//todo: have tried to refactor this to return a list of the airline names only, but then it doesn't work :)
		let airlinesToFilter = alteredAirlines.filter(airline => {
			return !airline.checked;
		});
		setAirlinesUnchecked(airlinesToFilter);

		let newFlights = originalFlights.filter(flight => {
			//
			let airlineNamesOnly = airlinesToFilter.map(airline => airline.airline);
			if (!airlineNamesOnly.includes(flight.airline)) {
				return flight;
			}
		});

		setFlights(newFlights);

		let newReturnFlights = originalReturnFlights.filter(flight => {
			//
			let airlineNamesOnly = airlinesToFilter.map(airline => airline.airline);
			if (!airlineNamesOnly.includes(flight.airline)) {
				return flight;
			}
		});

		setReturnFlights(newReturnFlights);
	};

	return (
		<div>
			<Router>
				<Header/>
				{/*todo refactor into separate component */}
				{console.log(airlines)}
				{airlines.map(airline => <div key={airline.airline} className={"form-check-inline"}><input id={airline}
																										   className={"form-check-input"}
																										   type={"checkbox"}
																										   onChange={handleCheckbox}
																										   name={airline.airline}
																										   checked={airline.checked}/>
					<label className={"form-check-label"}>{airline.airline}</label>
				</div>)}
				<button className={"btn btn-primary btn-sm"} onClick={() => {
					setFlights(originalFlights);
					setReturnFlights(originalReturnFlights);
					const distinct = (value, index, self) => {
						return self.indexOf(value) === index;
					};
					const allAirlines = originalFlights.map(data => data.airline);
					const airlinesAlmost = allAirlines.filter(distinct);
					const airlines = airlinesAlmost.map(airline => {
						return {airline: airline, checked: true}
					});
					setAirlines(airlines);
				}}>Reset
				</button>
				<br/>

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
							? <FlightSearchReturn setFlights={setFlights} setOriginalFlights={setOriginalFlights} setReturnFlights={setReturnFlights} setOriginalReturnFlights={setOriginalReturnFlights}/>
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
