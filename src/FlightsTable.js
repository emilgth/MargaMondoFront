import React, {useEffect, useState} from "react"
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import facade from "./apiFacade";

export const FlightsTable = () => {
	const [flights, setFlights] = useState([]);
	const [msg, setMsg] = useState("");
	const columns = [{
		dataField: 'departureAirportName',
		text: 'Departure Location',
	}, {
		dataField: 'arrivalAirportName',
		text: 'Arrival Location',
	}, {
		dataField: 'departureTime',
		text: 'Departure Time'
	}, {
		dataField: 'arrivalTime',
		text: 'Arrival Time'
	}, {
		dataField: 'flightDuration',
		text: 'Flight Duration'
	}, {
		dataField: 'price',
		text: 'Price'
	}, {
		dataField: 'airline',
		text: 'Airline'
	}];
	useEffect(() => {
		// setMsg("Loading...");
		facade.fetchAllFlights().then(data => setFlights(data));
		// setMsg("");

		//todo fetch data from API
		// setFlights([
		// 	{
		// 		departureLocation: 'Copenhagen',
		// 		arrivalLocation: 'Paris',
		// 		departureTime: 213432,
		// 		arrivalTime: 12391238,
		// 		flightDuration: 231355,
		// 		price: 124,
		// 		airline: "FcukLnine"
		// 	},
		// 	{
		// 		departureLocation: 'Copenhagen',
		// 		arrivalLocation: 'Paris',
		// 		departureTime: 213432,
		// 		arrivalTime: 12391238,
		// 		flightDuration: 231355,
		// 		price: 124,
		// 		airline: "FcukLnine"
		// 	},
		// 	{
		// 		departureLocation: 'Copenhagen',
		// 		arrivalLocation: 'Paris',
		// 		departureTime: 213432,
		// 		arrivalTime: 12391238,
		// 		flightDuration: 231355,
		// 		price: 124,
		// 		airline: "FcukLnine"
		// 	}]);
	}, []);

	return (
		<div>
			<h2>All Flights</h2>
			{msg}
			{console.log(flights)}
			<BootstrapTable
				striped
				hover
				bootstrap4
				keyField='id'
				data={flights}
				columns={columns}
				filter={filterFactory()}
				pagination={paginationFactory()}
			/>

		</div>
	);
};