import React, { useState, useContext } from "react";
import "./App.css";
import { ThemeContext, themes } from './ThemeContext';
import {Link} from "react-router-dom";
import request from "./utils/request";
import endpoints from "./endpoints.json";
import {useAuth0} from "@auth0/auth0-react";

export function EstablishmentsList(){
    let themeContext = useContext(ThemeContext);
    let [establishments, setEstablishments] = useState([]);

    let {
        loading,
        loginWithRedirect,
        logout,
        getAccessTokenSilently,
        isAuthenticated,
    } = useAuth0();

    //Handle Establishments
    let handleEstablishmentsClick = async (e) => {
        e.preventDefault();
        let establishments = await request(
            `${process.env.REACT_APP_SERVER_URL}${endpoints.establishments}`,
            getAccessTokenSilently,
            loginWithRedirect
        );

        if (establishments && establishments.length > 0) {
            console.log(establishments);
            setEstablishments(establishments);
        }
    };

    //Handle Establishments
    let handleEstablishmentsTypesClick = async (e) => {
        e.preventDefault();
        let establishments = await request(
            `${process.env.REACT_APP_SERVER_URL}${endpoints.establishments}`,
            getAccessTokenSilently,
            loginWithRedirect
        );

        if (establishments && establishments.length > 0) {
            console.log(establishments);
            setEstablishments(establishments);
        }
    };


    return(
        <>
            <h2 style={{color: themes[themeContext.theme].foreground}}>List of Establishments</h2>
            <button
                onClick={handleEstablishmentsClick}
            >
                Get Establishments
            </button>
            <label>
                Establishment type :
                <select>
                    <option value="All">All</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Cinema">Cinema</option>
                </select>
            </label>
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
            </ul>
        </>
    );



}