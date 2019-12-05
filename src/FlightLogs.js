import React from "react";
import apiFacade from "./apiFacade";


export const LogButton = ({setLog, setSearchLog}) => {
    return <div>
        <button className={"btn btn-success mb-3 mr-3"}
                onClick={() => apiFacade.fetchAllLogs().then(data => {
                    data.forEach(() => setLog(data))
                })}>
            View booking logs
        </button>
        <button className={"btn btn-success mb-3"}
                onClick={() => apiFacade.fetchAllSearchLogs().then(data => {
                    data.forEach(() => setSearchLog(data))
                })}>
            View search logs
        </button>
    </div>
};

export const LogTable = ({log}) => {

    function msToTime(duration) {
        let seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        return hours + ":" + minutes + ":" + seconds;
    }

    if (log) {
        return <div>
            <table className={"table-bordered bg-marge mb-3"}>
                <thead>
                <tr>
                    <th>Departure airport</th>
                    <th>Arrival airport</th>
                    <th>Departure</th>
                    <th>Return</th>
                    <th>Flight duration</th>
                    <th>Adults</th>
                    <th>Children</th>
                    <th>Price total</th>
                </tr>
                </thead>
                <tbody>
                {log.map((flight) => {
                    let convertedDepartureDate = new Date(parseFloat(flight.departureDate)).toDateString();
                    let convertedReturnDate = new Date(parseFloat(flight.returnDate)).toDateString();
                    let convertedFlightDuration = msToTime(flight.flightDuration);
                    if (convertedReturnDate === "Invalid Date") {
                        convertedReturnDate = "";
                    }
                    return (
                        <tr key={flight.id}>
                            <td>{flight.departureAirport}</td>
                            <td>{flight.arrivalAirport}</td>
                            <td>{convertedDepartureDate}</td>
                            <td>{convertedReturnDate}</td>
                            <td>{convertedFlightDuration}</td>
                            <td>{flight.adults}</td>
                            <td>{flight.children}</td>
                            <td>{flight.price}</td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    } else {
        return <div>

        </div>
    }
};

export const SearchLogTable = ({searchLog}) => {
    if (searchLog) {
        console.log(searchLog);
        return <div>
            <table className={"table-bordered bg-marge mb-3"}>
                <thead>
                <tr>
                    <th>Departure airport</th>
                    <th>Arrival airport</th>
                    <th>Departure</th>
                    <th>Return</th>
                </tr>
                </thead>
                <tbody>
                {searchLog.map((flight) => {
                    let convertedDepartureDate = new Date(parseFloat(flight.dateTime)).toDateString();
                    let convertedReturnDate = new Date(parseFloat(flight.returnDate)).toDateString();
                    if (convertedReturnDate === "Invalid Date" || convertedReturnDate === "Thu Jan 01 1970") {
                        convertedReturnDate = "";
                    }
                    return (
                        <tr key={flight.id}>
                            <td>{flight.departure}</td>
                            <td>{flight.destination}</td>
                            <td>{convertedDepartureDate}</td>
                            <td>{convertedReturnDate}</td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    } else {
        return <div>

        </div>
    }
};