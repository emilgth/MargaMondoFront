import React, {useEffect, useState} from "react"
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import facade from "./apiFacade";
import {Redirection} from "./Redirection";
import {BrowserRouter as Router, NavLink, Route, Switch} from "react-router-dom";

export const FlightsTable = ({flights}) => {

	const columns = [{
		dataField: 'departureAirportName',
		text: 'Departure Location',
	}, {
		dataField: 'arrivalAirportName',
		text: 'Arrival Location',
	}, {
		dataField: 'departureTime',
		text: 'Departure Time',
		sort: true,

		sortFunc: (date1, date2, order, dataField) => {
			let aa = new Date(date1);
			let bb = new Date(date2);
			if (order === 'asc') {
				return bb - aa;
			}
			return aa - bb; // desc
		}
	}, {
		dataField: 'arrivalTime',
		text: 'Arrival Time',

	}, {
		dataField: 'flightDuration',
		text: 'Flight Duration',
		sort: true
	}, {
		dataField: 'price',
		text: 'Price',
		sort: true
	}, {
		dataField: 'airline',
		text: 'Airline'
	}];


	const expandRow = {
		// showExpandColumn: false,
		onlyOneExpanding: true,
		renderer: row => (
			<div>
				<p>
					<NavLink to="/redirecting">Redirect to booking</NavLink><p>Class: {row["flightClass"]}</p>
				</p>
			</div>
		)
	};

	return (
		<div>
			<h2>All Flights</h2>
			<BootstrapTable
				striped
				hover
				bootstrap4
				keyField={"id"}
				data={flights}
				columns={columns}
				filter={filterFactory()}
				pagination={paginationFactory()}
				expandRow={ expandRow }
			/>

		</div>
	);
};

export const FlightsTableReturn = ({flights, returnFlights}) => {

	FlightsTable(flights);

	const columns = [{
		dataField: 'departureAirportName',
		text: 'Departure Location',
	}, {
		dataField: 'arrivalAirportName',
		text: 'Arrival Location',
	}, {
		dataField: 'departureTime',
		text: 'Departure Time',
		sort: true,

		sortFunc: (date1, date2, order, dataField) => {
			let aa = new Date(date1);
			let bb = new Date(date2);
			if (order === 'asc') {
				return bb - aa;
			}
			return aa - bb; // desc
		}
	}, {
		dataField: 'arrivalTime',
		text: 'Arrival Time',

	}, {
		dataField: 'flightDuration',
		text: 'Flight Duration'
	}, {
		dataField: 'price',
		text: 'Price',
		sort: true
	}, {
		dataField: 'airline',
		text: 'Airline'
	}];

	const expandRow = {
		// showExpandColumn: false,
		onlyOneExpanding: true,
		renderer: row => (
			<div>
				<p>
					<NavLink to="/redirecting">Redirect to booking</NavLink>
				</p>
			</div>
		)
	};

	return (
		<div>
			<h2>All Flights</h2>
			<BootstrapTable
				striped
				hover
				bootstrap4
				keyField={"id"}
				data={flights}
				columns={columns}
				filter={filterFactory()}
				pagination={paginationFactory()}
				expandRow={expandRow}
			/>
			<h2>Return Flights</h2>
			<BootstrapTable
				striped
				hover
				bootstrap4
				keyField={"id"}
				data={returnFlights}
				columns={columns}
				filter={filterFactory()}
				pagination={paginationFactory()}
				expandRow={expandRow}
			/>
		</div>
	);
};