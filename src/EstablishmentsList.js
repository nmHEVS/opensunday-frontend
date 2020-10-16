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

    const types = ["All", "2", "3"];

    const handleSelect=(e)=>{
        console.log(e);
        setEstablishmentTypeSelected(e)

    }

    //Handle Establishments
    let handleEstablishmentsClick = async (e) => {
        e.preventDefault();
        console.log(establishmentTypeSelected);

        if(establishmentTypeSelected === "All") {
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
        }else{
            let establishments = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.establishmentsByType}${establishmentTypeSelected}`,
                getAccessTokenSilently,
                loginWithRedirect
            );

            console.log("2 or 3");

            if (establishments && establishments.length > 0) {
                console.log(establishments);
                setEstablishments(establishments);
            }
        }


    };




    return(
        <>
            <h2 style={{color: themes[themeContext.theme].foreground}}>List of Establishments</h2>

            {/*<label>
                Establishment type :
                <select value={establishmentTypeSelected} onChange={setEstablishmentTypeSelected}>
                    <option value="All">All</option>
                    <option value="2">Restaurant</option>
                    <option value="3">Cinema</option>
                </select>
            </label>*/}

            <DropdownButton
                alignRight
                title="Choose type of establishment "
                id="dropdown-menu-align-right"
                onSelect={handleSelect}
            >
                <Dropdown.Item eventKey="All">All</Dropdown.Item>
                <Dropdown.Item eventKey="2">Restaurant</Dropdown.Item>
                <Dropdown.Item eventKey="3">Cinema</Dropdown.Item>
            </DropdownButton>

            <button
                onClick={handleEstablishmentsClick}
            >
                Get Establishments
            </button>

            <h3>List of all {establishmentTypeSelected}</h3>
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