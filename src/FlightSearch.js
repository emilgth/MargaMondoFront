import React, {useState} from "react";
import apiFacade from "./apiFacade";

export const FlightSearch = ({setFlights}) => {
    const [searchData, setSearchData] = useState({destination: "", departure: "", dateTime: ""});
    return (
		<div className={"input-group"}>
			<input className={"form-control input-group-prepend"} placeholder={"Destination"} onChange={event => setSearchData({...searchData, destination: event.target.value})}/>
			<input className={"form-control"} placeholder={"Departure"} onChange={event => setSearchData({...searchData, departure: event.target.value})}/>
			<input className={"form-control"} onChange={event => setSearchData({...searchData, dateTime: event.target.value})} type={"date"}/>
			<button className={"btn btn-primary input-group-append"} onClick={() => apiFacade.searchFlights(searchData).then(data => {
				console.log(data);
				setFlights(data)
			})}>search</button>
		</div>
    )
};

export const FlightSearchReturn = ({setFlights, setReturnFlights}) => {
    const [searchData, setSearchData] = useState({destination: "", departure: "", dateTime: "", returnDate: ""});

	return (
		<div className={"input-group"}>
			<input className={"form-control input-group-prepend"} placeholder={"Destination"}
				   onChange={event => setSearchData({...searchData, destination: event.target.value})}/>
			<input className={"form-control"} placeholder={"Departure"}
				   onChange={event => setSearchData({...searchData, departure: event.target.value})}/>
			<input className={"form-control"}
				   onChange={event => setSearchData({...searchData, dateTime: event.target.value})} type={"date"}/>
			<input className={"form-control"} onChange={event => setSearchData({...searchData, returnDate: event.target.value})} type={"date"}/>
			<button className={"btn btn-primary input-group-append"} onClick={() => apiFacade.searchFlights(searchData).then(data => {
				console.log(data);
				setFlights(data);
				const returnData = {destination: searchData.departure, departure: searchData.destination, dateTime: searchData.returnDate};
				apiFacade.searchFlights(returnData).then(data => {setReturnFlights(data)})
			})}>search
			</button>
		</div>
	);
};

