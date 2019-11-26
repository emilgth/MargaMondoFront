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
    const [flights, setFlights] = useState([]);
    const [returnFlights, setReturnFlights] = useState([]);
    const [returnChecked, setReturnChecked] = useState("off");

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
						<label>
							<input
								type={"checkbox"}
								onChange={() => returnChecked === "off"
									? setReturnChecked("on") : setReturnChecked("off")}/>Return
							ticket
						</label>
						{returnChecked === "on"
							? <FlightSearchReturn setFlights={setFlights} setReturnFlights = {setReturnFlights}/>
							: <FlightSearch setFlights={setFlights}/>}
						{returnChecked === "on"
							? <FlightsTableReturn flights={flights} returnFlights = {returnFlights}/>
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
