import React, {useState} from 'react';

export const PriceSlider = ({originalFlights, setFlights}) => {
    const [maxPrice, setMaxPrice] = useState(1500);

    function handleButton() {
        let newFlights = [];
        originalFlights.forEach(flight => {
            if (flight.price <= maxPrice) {
                newFlights.push(flight)
            }
        });
        setFlights(newFlights);
    }

    return (
        <div>
            <label>Max price: ${maxPrice}
                <input type={"range"} min={1} max={1500}  onChange={event => {
                    setMaxPrice(parseInt(event.target.value))
                }} className={"form-control slider"}/>
            </label>
            <button className={"btn btn-sm btn-success"} onClick={handleButton}>Filter by price</button>
        </div>
    );
};

export const TimeSlider = ({originalFlights, setFlights}) => {
    const [maxTime, setMaxTime] = useState(0);

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

    function handleButton() {
        let newFlights = [];
        originalFlights.forEach(flight => {
            let flightTimeToCompareWith = new Date(flight.departureTime);
            flightTimeToCompareWith.setHours(0);
            flightTimeToCompareWith.setMinutes(0);
            flightTimeToCompareWith.setSeconds(0);
            if (Date.parse(flight.departureTime) <= Date.parse(flightTimeToCompareWith.toString()) + maxTime) {
                newFlights.push(flight)
            }
        });
        setFlights(newFlights);
    }

    return (
        <div>
            <label>Latest departure: {msToTime(maxTime)}
                <input type={"range"} min={1} max={86399999}  onChange={event => {
                    setMaxTime(parseInt(event.target.value))
                }} className={"form-control slider"}/>
            </label>
            <button className={"btn btn-sm btn-success"} onClick={handleButton}>Filter by time</button>
        </div>
    );
};
