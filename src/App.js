import React, {useEffect, useState} from "react"
import {FlightsTable} from "./FlightsTable";
import {BrowserRouter as Router, NavLink, Route, Switch} from "react-router-dom";
import {FlightSearch} from "./FlightSearch";
import facade from "./apiFacade";
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
	const [originalFlights, setOriginalFlights] = useState([]); //this is the list of flights retrieved by the fetch function, it shouldn't be altered by anything, but the fetch function
	const [flights, setFlights] = useState(originalFlights); //this is the list of flights used to actually display the list, and the one altered by various functions
	const [airlines, setAirlines] = useState([]); //this is used to display the checkboxes
	const [airlinesUnchecked, setAirlinesUnchecked] = useState([]);

	useEffect(() => {
		facade.fetchAllFlights().then(data => {
			setOriginalFlights(data);
			setFlights(data);
			//pull out the distinct airlines from the list of flights
			const distinct = (value, index, self) => {
				return self.indexOf(value) === index;
			};
			const allAirlines = data.map(data => data.airline);
			const airlinesAlmost = allAirlines.filter(distinct);
			//adds a 'checked' property to the list of airlines
			const airlines = airlinesAlmost.map(airline => {
				return {airline: airline, checked: true}
			});
			setAirlines(airlines);
		});

	}, []);

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

		let newFlights = flights.filter(flight => {
			//
			let airlineNamesOnly = airlinesToFilter.map(airline => airline.airline);
			if (!airlineNamesOnly.includes(flight.airline)) {
				return flight;
			}
		});

		setFlights(newFlights);
	};

	return (
		<div>
			<Router>
				<Header/>
				{airlines.map(airline => <div><input type={"checkbox"} onChange={handleCheckbox} name={airline.airline}
				                                     checked={airline.checked}/>{airline.airline}<br/>
				</div>)}
				<button onClick={() => {
					setFlights(originalFlights);
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

				<Switch>
					<Route exact path={"/"}>
						<Welcome/>
					</Route>
				</Switch>
				<FlightSearch setFlights={setFlights}/>
				<FlightsTable flights={flights}/>
			</Router>
		</div>
	);
}

export default App;
