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
	const [flights, setFlights] = useState([]);

	useEffect(() => {
		facade.fetchAllFlights().then(data => {
			//todo: fix typo in the global array >:)
			let combinedArrays = [...data[0], ...data[1]];
			let flightsFormattedTime = combinedArrays.map(flight => {
				flight.flightDuration = msToTime(flight.flightDuration);
				return flight;
			});
			setFlights(flightsFormattedTime)
		});
	}, []);

	function msToTime(duration) {
		let seconds = Math.floor((duration / 1000) % 60),
			minutes = Math.floor((duration / (1000 * 60)) % 60),
			hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

		hours = (hours < 10) ? "0" + hours : hours;
		minutes = (minutes < 10) ? "0" + minutes : minutes;
		seconds = (seconds < 10) ? "0" + seconds : seconds;

		return hours + ":" + minutes + ":" + seconds;
	}

	return (
		<div>
			<Router>
				<Header/>
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
