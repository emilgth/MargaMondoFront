import React from "react"
import {FlightsTable} from "./FlightsTable";
import {BrowserRouter as Router, NavLink, Route, Switch} from "react-router-dom";

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
	return (
		<div>
			<Router>
				<Header/>
				<Switch>
					<Route exact path={"/"}>
						<Welcome/>
					</Route>
				</Switch>
				<FlightsTable/>
			</Router>
		</div>
	);
}

export default App;
