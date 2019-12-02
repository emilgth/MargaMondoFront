import React, {useEffect, useState} from "react"
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {BrowserRouter as Router, NavLink, Route, Switch} from "react-router-dom";
import loading from './Images/loading.gif'


export const Redirection = () => {
    return(
        <div>
            <img className={"loading-gif"}  src={loading} alt="loading..."/>
        </div>
    );
};

