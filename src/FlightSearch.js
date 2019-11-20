import React, {useState} from "react";

export const FlightSearch = () => {
	const [searchData, setSearchData] = useState({destination: "", arrival: "", dateTime: ""});
	return (
		<div>
	<input onChange={event => setSearchData({...searchData, destination: event.target.value})}/>
	<input onChange={event => setSearchData({...searchData, arrival: event.target.value})}/>
	<input onChange={event => setSearchData({...searchData, dateTime: event.target.value})} type={"date"}/>
	<button onClick={() => console.log(searchData)}>search</button>
		</div>
	)
};