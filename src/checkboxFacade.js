export function handleAirlinesCheckbox(airlines, setAirlines, setAirlinesUnchecked, originalFlights, setFlights, originalReturnFlights, setReturnFlights) {
    return (event) => {
        const target = event.target;
        //sets the target airline's 'checked' property to the opposite
        let alteredAirlines = airlines.map(airline => {
            if (target.name === airline.airline) {
                return {airline: airline.airline, checked: !!target.checked};
            } else {
                return airline;
            }
        });
        setAirlines(alteredAirlines);

        //returns a list of airlines to be filtered out of the flight list
        //todo: have tried to refactor this to return a list of the airline names only, but then it doesn't work :)
        let airlinesToFilter = alteredAirlines.filter(airline => {
            return !airline.checked;
        });
        setAirlinesUnchecked(airlinesToFilter);

        let newFlights = originalFlights.filter(flight => {
            //
            let airlineNamesOnly = airlinesToFilter.map(airline => airline.airline);
            if (!airlineNamesOnly.includes(flight.airline)) {
                return flight;
            }
        });

        setFlights(newFlights);

        let newReturnFlights = originalReturnFlights.filter(flight => {
            //
            let airlineNamesOnly = airlinesToFilter.map(airline => airline.airline);
            if (!airlineNamesOnly.includes(flight.airline)) {
                return flight;
            }
        });

        setReturnFlights(newReturnFlights);
    };
}