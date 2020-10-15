import React, { useState, useContext } from "react";
import "./App.css";
import { ThemeContext, themes } from './ThemeContext';
import {Link} from "react-router-dom";
import request from "./utils/request";
import endpoints from "./endpoints.json";

export function EstablishmentsList(){
    let themeContext = useContext(ThemeContext);
    //let [establishments, setEstablishments] = useState([]);




    return(
        <>
            <h2 style={{color: themes[themeContext.theme].foreground}}>List of Establishments</h2>
            {/*
            <ul className="EstablishmentsList">
                {establishments.map((establishment) => (
                    <li key={establishment.id}>
                        <Link
                            className="App-link"
                            to={`/establishment/${establishment.id}`}
                        >
                            {establishment.name}
                        </Link>
                    </li>
                ))}
            </ul>*/}
        </>
    );



}