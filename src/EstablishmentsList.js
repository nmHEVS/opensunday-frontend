import React, {useState, useContext, useEffect} from "react";
import "./App.css";
import { ThemeContext, themes } from './ThemeContext';
import {Link} from "react-router-dom";
import request from "./utils/request";
import endpoints from "./endpoints.json";
import {useAuth0} from "@auth0/auth0-react";
import 'bootstrap/dist/css/bootstrap.min.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import * as formik from "formik";


export function EstablishmentsList(){
    let themeContext = useContext(ThemeContext);
    let [establishments, setEstablishments] = useState([]);
    let [establishmentsTypes, setEstablishmentsTypes] = useState([]);
    let [establishmentTypeSelected, setEstablishmentTypeSelected] = useState([]);
    let {
        loading,
        loginWithRedirect,
        logout,
        getAccessTokenSilently,
        isAuthenticated,
    } = useAuth0();

    //Use effect to display the complete list of establishment as we open the page
    useEffect(() => {
        async function getEstablishments() {
            let establishments = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.establishments}`,
                getAccessTokenSilently,
                loginWithRedirect
            );

            if (establishments && establishments.length > 0) {
                console.log(establishments);
                setEstablishments(establishments);
            }
        }

        async function getEstablishmentsTypes() {
            let establishmentsTypes = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.establishmentsTypes}`,
                getAccessTokenSilently,
                loginWithRedirect
            );

            if (establishmentsTypes && establishmentsTypes.length > 0) {
                console.log(establishmentsTypes);
                setEstablishmentsTypes(establishmentsTypes);
            }
        }
        getEstablishments();
        getEstablishmentsTypes();
    }, []);


    let handleSelect = async (e) => {
        console.log("e = " + e);

        //console.log("Est. before set up " + establishmentTypeSelected);

        console.log('selected type id', e.target.value)
        let establishmentTypeId = e.target.value;
        setEstablishmentTypeSelected(establishmentTypeId);

        //e.preventDefault();
        console.log("Est. selected " + establishmentTypeSelected);

        if (establishmentTypeId === "All" || null) {
            let establishments = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.establishments}`,
                getAccessTokenSilently,
                loginWithRedirect
            );

            console.log("all");

            if (establishments && establishments.length > 0) {
                console.log(establishments);
                setEstablishments(establishments);
            }
        } else {
            console.log("type : " +establishmentTypeSelected);

            let establishments = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.establishmentsByType}${establishmentTypeId}`,
                getAccessTokenSilently,
                loginWithRedirect
            );

            console.log("type specified");

            if (establishments && establishments.length > 0) {
                console.log(establishments);
                setEstablishments(establishments);
            }
        }
        console.log("Est. type selected after all : " + establishmentTypeSelected);
    }



    return(
        <>
            <h2 style={{color: themes[themeContext.theme].foreground}}>List of Establishments</h2>

            {/*Sellect the type of establishment you want to display*/}
            <select
                id="establishmentType"
                name="establishmentType"
                type="text"
                onChange={handleSelect}
                value={establishmentTypeSelected}
                placeholder="Establishment type"
            >
                <option value={"All"}>All</option>
                {establishmentsTypes.map((establishmentsType) => (

                    <option value={establishmentsType.id}>
                        {establishmentsType.establishmentTypeName}
                        {console.log(establishmentsType.id)}
                    </option>
                ))}
            </select>

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