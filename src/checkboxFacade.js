import React from 'react'

export function handleFlightClassCheckbox(flightClasses, setFlightClasses, setFlightClassesUnchecked, originalFlights, setFlights, originalReturnFlights, setReturnFlights, airlinesUnchecked) {
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

        //returns a list of classes to be filtered out of the flight list
        let classesToFilter = alteredClasses
            .filter(flightClass => {
                return !flightClass.checked;
            })
            .map(flightClass => flightClass.flightClass);
        setFlightClassesUnchecked(classesToFilter);
        let newFlights = originalFlights.filter(flight => !(classesToFilter.includes(flight.flightClass) || airlinesUnchecked.includes(flight.airline)));
        let newReturnFlights = originalReturnFlights.filter(flight => !(classesToFilter.includes(flight.flightClass) || airlinesUnchecked.includes(flight.airline)));

        setFlights(newFlights);
        setReturnFlights(newReturnFlights);
    };
}

export function handleAirlinesCheckbox(airlines, setAirlines, setAirlinesUnchecked, originalFlights, setFlights, originalReturnFlights, setReturnFlights, flightClassesUnchecked) {
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
        let airlinesToFilter = alteredAirlines
            .filter(airline => {
                return !airline.checked;
            })
            .map(airline => airline.airline);
        setAirlinesUnchecked(airlinesToFilter);
        let newFlights = originalFlights.filter(flight => !(airlinesToFilter.includes(flight.airline) || flightClassesUnchecked.includes(flight.flightClass)));
        let newReturnFlights = originalReturnFlights.filter(flight => !(airlinesToFilter.includes(flight.airline) || flightClassesUnchecked.includes(flight.flightClass)));

        setFlights(newFlights);
        setReturnFlights(newReturnFlights);
    };
}

function resetAirlines(setFlights, originalFlights, setReturnFlights, originalReturnFlights, setAirlines) {
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
        <button className={"button"} onClick={() => {
            resetAirlines(setFlights, originalFlights, setReturnFlights, originalReturnFlights, setAirlines);
        }}>Reset
        </button>
        <br/>
    </div>;
}

function resetFlightClasses(setFlights, originalFlights, setReturnFlights, originalReturnFlights, setFlightClasses) {
    setFlights(originalFlights);
    setReturnFlights(originalReturnFlights);
    const distinct = (value, index, self) => {
        return self.indexOf(value) === index;
    };
    const allFlightClasses = [];
    originalFlights.forEach(data => {
        if (data.flightClass !== undefined) {
            allFlightClasses.push(data.flightClass);
        }
    });

    const flightClassesAlmost = allFlightClasses.filter(distinct);

    //adds a 'checked' property to the list of airlines

    const flightClasses = flightClassesAlmost.map(flightClass => {
        return {flightClass: flightClass, checked: true}
    });
    setFlightClasses(flightClasses);
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
        <button className={"button"} onClick={() => {
            resetFlightClasses(setFlights, originalFlights, setReturnFlights, originalReturnFlights, setFlightClasses);
        }}>Reset
        </button>
        <br/>
    </div>;
};