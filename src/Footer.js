import React, {useEffect, useState} from "react"
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {FlightsTable, FlightsTableReturn} from "./FlightsTable";
import {BrowserRouter as Router, NavLink, Route, Switch} from "react-router-dom";
import {FlightSearch, FlightSearchReturn} from "./FlightSearch";
import facade from "./apiFacade";
import {Redirection} from "./Redirection";
import Logo from "./purple.svg"
import Margamondo from "./margamond.png"


export const Footer = () => {
    return (
        <div>
            <nav className="navbar navbar-expand-sm bg-orange shadow-lg navbar-dark">
                <a className="navbar-brand"/>
            </nav>

        </div>
    )
};

