import React, {useState, useEffect} from "react"
import {FlightsTable} from "./FlightsTable";
import {BrowserRouter as Router, NavLink, Route, Switch} from "react-router-dom";
import {FlightSearch} from "./FlightSearch";
import facade from "./apiFacade";

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
		facade.fetchAllFlights().then(data => setFlights(data));
	}, []);

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
