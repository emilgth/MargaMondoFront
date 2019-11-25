import React, {useState} from "react";
import apiFacade from "./apiFacade";

export const FlightSearch = ({setFlights}) => {
	const [searchData, setSearchData] = useState({destination: "", departure: "", dateTime: ""});
	return (
		<div>
	<input placeholder={"Destination"} onChange={event => setSearchData({...searchData, destination: event.target.value})}/>
	<input placeholder={"Departure"} onChange={event => setSearchData({...searchData, departure: event.target.value})}/>
	<input onChange={event => setSearchData({...searchData, dateTime: event.target.value})} type={"date"}/>
	<button onClick={() => apiFacade.searchFlights(searchData).then(data => {
		console.log(data);
		setFlights(data)
	})}>search</button>
		</div>
	)
};