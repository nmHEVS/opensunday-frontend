import React, {useState, useContext, useEffect} from "react";
import "./App.css";
import { ThemeContext, themes } from './ThemeContext';
import {Link} from "react-router-dom";
import request from "./utils/request";
import endpoints from "./endpoints.json";
import {useAuth0} from "@auth0/auth0-react";
import 'bootstrap/dist/css/bootstrap.min.css';



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

    //Use effect to display get data we need as we open the page
    useEffect(() => {

        //get all establishment to display a complete list
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

        //get all types of establishment to put in the select
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

    //get the list of establishments of the type selected
    let handleSelect = async (e) => {
        console.log('selected type id : ', e.target.value)
        let establishmentTypeId = e.target.value;
        setEstablishmentTypeSelected(establishmentTypeId);

        if (establishmentTypeId == 0 || null) {
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

            let establishments = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.establishmentsByType}${establishmentTypeId}`,
                getAccessTokenSilently,
                loginWithRedirect
            );

            console.log("type specified");
            console.log(establishments);
            setEstablishments(establishments);

        }
    }

    //Display a message if there is no est. in a type
    function EmptyTypeTag(){return <h3>There is no establishment of this type yet</h3>}
    function EmptyType(){
        if(establishments.length == 0){
            return <EmptyTypeTag/>
        }else{
            return null;
        }
    }



    return(
        <>
            <h2 style={{color: themes[themeContext.theme].foreground}}>List of Establishments</h2>

            {/*Select the type of establishment you want to display*/}
            <select
                id="establishmentType"
                name="establishmentType"
                type="text"
                onChange={handleSelect}
                value={establishmentTypeSelected}
                placeholder="Establishment type"
            >
                <option value={0} >All</option>
                {establishmentsTypes.map((establishmentsType) => (
                    <option value={establishmentsType.id} key={establishmentsType.id}>
                        {establishmentsType.establishmentTypeName}
                    </option>
                ))}
            </select>

            <ul className="EstablishmentsList">
                {establishments
                    .sort((a, b) => a.name > b.name ? 1:-1)
                    .map((establishment) => (
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
            <EmptyType/>
        </>
    );



}