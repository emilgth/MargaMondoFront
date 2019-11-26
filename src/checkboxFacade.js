import React from 'react'

export function handleFlightClassCheckbox(flightClasses, setFlightClasses, setFlightClassesUnchecked, originalFlights, setFlights, originalReturnFlights, setReturnFlights) {
    return (event) => {
        const target = event.target;
        //sets the target airline's 'checked' property to the opposite
        let alteredClasses = flightClasses.map(flightClass => {
            if (target.name === flightClass.flightClass) {
                return {flightClass: flightClass.flightClass, checked: !!target.checked};
            } else {
                return flightClass;
            }
        });
        setFlightClasses(alteredClasses);

        //returns a list of airlines to be filtered out of the flight list
        //todo: have tried to refactor this to return a list of the airline names only, but then it doesn't work :)
        let classesToFilter = alteredClasses.filter(flightClass => {
            return !flightClass.checked;
        });
        setFlightClassesUnchecked(classesToFilter);

        let newFlights = originalFlights.filter(flight => {
            //
            let classesNamesOnly = classesToFilter.map(flightClass => flightClass.flightClass);
            if (!classesNamesOnly.includes(flight.flightClass)) {
                return flight;
            }
        });

        setFlights(newFlights);

        let newReturnFlights = originalReturnFlights.filter(flight => {
            //
            let classesNamesOnly = classesToFilter.map(flightClass => flightClass.flightClass);
            if (!classesNamesOnly.includes(flight.flightClass)) {
                return flight;
            }
        });

        setReturnFlights(newReturnFlights);
    };
}

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

export function renderAirlinesCheckboxes(airlines, handleCheckbox, setFlights, originalFlights, setReturnFlights, originalReturnFlights, setAirlines) {
    return <div>
        {airlines.map(airline =>
            <div key={airline.airline} className={"form-check-inline"}>
                <input id={airline}
                       className={"form-check-input"}
                       type={"checkbox"}
                       onChange={handleCheckbox}
                       name={airline.airline}
                       checked={airline.checked}/>
                <label className={"form-check-label"}>{airline.airline}</label>
            </div>)}
        <button className={"btn btn-primary btn-sm"} onClick={() => {
            setFlights(originalFlights);
            setReturnFlights(originalReturnFlights);
            const distinct = (value, index, self) => {
                return self.indexOf(value) === index;
            };
            const allAirlines = originalFlights.map(data => data.airline);
            const airlinesAlmost = allAirlines.filter(distinct);
            const airlines = airlinesAlmost.map(airline => {
                return {airline: airline, checked: true}
            });
            setAirlines(airlines);
        }}>Reset
        </button>
        <br/>
    </div>;
}

export const RenderClassesCheckboxes = ({flightClasses, handleClassCheckbox, setFlights, originalFlights, setReturnFlights, originalReturnFlights, setFlightClasses}) => {
    return <div>
        {flightClasses.map(flightClass =>
            <div key={flightClass.flightClass} className={"form-check-inline"}>
                <input id={flightClass}
                       className={"form-check-input"}
                       type={"checkbox"}
                       onChange={handleClassCheckbox}
                       name={flightClass.flightClass}
                       checked={flightClass.checked}/>
                <label className={"form-check-label"}>{flightClass.flightClass}</label>
            </div>)}
        <button className={"btn btn-primary btn-sm"} onClick={() => {
            setFlights(originalFlights);
            setReturnFlights(originalReturnFlights);
            const distinct = (value, index, self) => {
                return self.indexOf(value) === index;
            };
            const allFlightClasses = originalFlights.map(data => data.flightClass);
            const classesAlmost = allFlightClasses.filter(distinct);
            const flightClassses = classesAlmost.map(flightClass => {
                return {flightClass: flightClass, checked: true}
            });
            setFlightClasses(flightClassses);
        }}>Reset
        </button>
        <br/>
    </div>;
};