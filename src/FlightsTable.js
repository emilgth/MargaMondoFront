import React, {useEffect, useState} from "react"
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import facade from "./apiFacade";
import {Redirection} from "./Redirection";
import {BrowserRouter as Router, NavLink, Route, Switch} from "react-router-dom";

export const FlightsTable = ({flights, setSelectedFlight}) => {
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
                <a href="http://localhost:3000/redirecting" button type="button" class="button">Redirect to
                    booking</a>
                <p>Class: {row["flightClass"]}</p>
            </div>
        )
    };

    const rowEvents = {
        onClick: (e, row) => {
            console.log(row);
            setSelectedFlight(row);
        }
    };

    return (
        <div className={"mt-5 bg-marge rounded p-2"}>
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
                rowEvents={rowEvents}
            />

        </div>
    );
};

export const NewFlightsTable = ({flights}) => {
    return (
        <div>
            {flights.map(flight => {
                return <div className={"container bg-marge rounded shadow-lg p-5 mb-3"}>
                    <div className={"row"}>
                        <div className={"col"}>
                            <h4><strong>{flight.airline}</strong></h4>
                        </div>
                        <div className={"col"}>
                            <p className={"text-right"}> {flight.departureAirportCode} - {flight.arrivalAirportCode}</p>
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col"}><p><strong>Departure:</strong> {flight.departureTime.slice(0, 21)}</p></div>
                        <div className={"col"}>
                            <p className={"text-right"}><strong>Flight duration:</strong> {flight.flightDuration.slice(0, 5)}</p>
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col"}><p><strong>Arrival:</strong> {flight.arrivalTime.slice(0, 21)}</p></div>

                        <div className={"col"}>
                            <h4 className={"text-right"}><strong>Price:</strong> ${flight.price},-</h4>
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col"}>
                            <em>{flight.flightClass}</em>
                        </div>
                        <div className={"col"}>
                            <button className={"btn-lg btn-success float-right"}>Book</button>
                        </div>

                    </div>


                </div>;
            })}
        </div>
    );

};

export const FlightsTableReturn = ({flights, returnFlights, setSelectedFlight, setSelectedReturnFlight}) => {

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

    const rowEvents = {
        onClick: (e, row) => {
            console.log(row);
            setSelectedFlight(row);
        }
    };

    const rowReturnEvents = {
        onClick: (e, row) => {
            console.log(row);
            setSelectedReturnFlight(row);
        }
    };

    return (
        <div className={"mt-5 bg-marge rounded p-2"}>
            <h2>All Flights</h2>
            <BootstrapTable
                striped
                hover
                bootstrap4
                id={"flightTable"}
                keyField={"id"}
                data={flights}
                columns={columns}
                filter={filterFactory()}
                pagination={paginationFactory()}
                expandRow={expandRow}
                rowEvents={rowEvents}
            />
            <h2>Return Flights</h2>
            <BootstrapTable
                striped
                hover
                bootstrap4
                name={"returnTable"}
                keyField={"id"}
                data={returnFlights}
                columns={columns}
                filter={filterFactory()}
                pagination={paginationFactory()}
                expandRow={expandRow}
                rowEvents={rowReturnEvents}
            />
        </div>
    );
};
