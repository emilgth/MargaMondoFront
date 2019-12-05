import React, {useState} from "react";
import apiFacade from "./apiFacade";

export const FlightSearch = ({setOriginalFlights, setFlights}) => {
    const [searchData, setSearchData] = useState({destination: "", departure: "", dateTime: ""});

    function msToTime(duration) {
        let seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
//todo change to 1 hours and 343 minutes
        return hours + ":" + minutes + ":" + seconds;
    }

    return (
        <div className={"input-group"}>
            <input className={"form-control input-group-prepend"} placeholder={"Departure"}
                   onChange={event => setSearchData({...searchData, departure: event.target.value})}/>
            <input className={"form-control"} placeholder={"Destination"}
                   onChange={event => setSearchData({...searchData, destination: event.target.value})}/>
            <input className={"form-control"}
                   onChange={event => setSearchData({...searchData, dateTime: event.target.value})} type={"date"}/>
            <div className={"input-group-append"}>
                <button className={"btn btn-success"}
                        onClick={() => {
                            apiFacade.logSearch(searchData).then((status) => console.log(status));
                            apiFacade.searchFlights(searchData).then(data => {
                                let flightsFormattedTime = data.map(flight => {
                                    flight.arrivalTime = new Date(Date.parse(flight.departureTime) + flight.flightDuration).toString();
                                    flight.flightDurationMS = flight.flightDuration;
                                    flight.flightDuration = msToTime(flight.flightDuration);
                                    flight.departureTime = new Date(Date.parse(flight.departureTime)).toString();
                                    flight.departureTimeMS = Date.parse(flight.departureTime);
                                    if (flight.flightClass === undefined) {
                                        flight.flightClass = "Unknown";
                                    }
                                    return flight;
                                });
                                setOriginalFlights(flightsFormattedTime);
                                setFlights(flightsFormattedTime);
                            });
                        }}>search
                </button>
            </div>
        </div>
    )
};

export const FlightSearchReturn = ({setOriginalFlights, setOriginalReturnFlights, setFlights, setReturnFlights}) => {
    const [searchData, setSearchData] = useState({destination: "", departure: "", dateTime: "", returnDate: ""});

    function msToTime(duration) {
        let seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
//todo change to 1 hours and 343 minutes
        return hours + ":" + minutes + ":" + seconds;
    }

    return (
        <div className={"input-group"}>
            <input className={"form-control"} placeholder={"Departure"}
                   onChange={event => setSearchData({...searchData, departure: event.target.value})}/>
            <input className={"form-control input-group-prepend"} placeholder={"Destination"}
                   onChange={event => setSearchData({...searchData, destination: event.target.value})}/>
            <input className={"form-control"}
                   onChange={event => setSearchData({...searchData, dateTime: event.target.value})} type={"date"}/>
            <input className={"form-control"}
                   onChange={event => setSearchData({...searchData, returnDate: event.target.value})} type={"date"}/>
            <div className={"input-group-append"}>
                <button className={"btn btn-success input-group-append"}
                        onClick={() => {
                            apiFacade.logSearch(searchData).then((status) => console.log(status));
                            apiFacade.searchFlights(searchData).then(data => {
                            console.log(data);
                            console.log(searchData);
                            let flightsFormattedTime = data.map(flight => {
                                flight.arrivalTime = new Date(Date.parse(flight.departureTime) + flight.flightDuration).toString();
                                flight.flightDurationMS = flight.flightDuration;
                                flight.flightDuration = msToTime(flight.flightDuration);
                                flight.departureTime = new Date(Date.parse(flight.departureTime)).toString();
                                flight.departureTimeMS = Date.parse(flight.departureTime);
                                if (flight.flightClass === undefined) {
                                    flight.flightClass = "Unknown";
                                }
                                return flight;
                            });
                            setOriginalFlights(flightsFormattedTime);
                            setFlights(flightsFormattedTime);
                            const returnData = {
                                destination: searchData.departure,
                                departure: searchData.destination,
                                dateTime: searchData.returnDate
                            };
                            apiFacade.searchFlights(returnData).then(data => {
                                let flightsFormattedTime = data.map(flight => {
                                    flight.arrivalTime = new Date(Date.parse(flight.departureTime) + flight.flightDuration).toString();
                                    flight.flightDurationMS = flight.flightDuration;
                                    flight.flightDuration = msToTime(flight.flightDuration);
                                    flight.departureTime = new Date(Date.parse(flight.departureTime)).toString();
                                    flight.departureTimeMS = Date.parse(flight.departureTime);
                                    if (flight.flightClass === undefined) {
                                        flight.flightClass = "Unknown";
                                    }
                                    return flight;
                                });
                                setOriginalReturnFlights(flightsFormattedTime);
                                setReturnFlights(flightsFormattedTime)
                            })
                        })}}>search
                </button>
            </div>
        </div>
    );
};

