import React, {useEffect, useState} from "react";
import "../App.css";
import Establishment from "../components/Establishment";
import {useAuth0} from "@auth0/auth0-react";
import request from "../utils/request";
import endpoints from "../endpoints.json";
import {Link} from "react-router-dom";

export default function EstablishmentDetails({ match }) {
    let establishmentID = +match.params.id;

    let [establishment, setEstablishment] = useState(null);

    let { loginWithRedirect, getAccessTokenSilently } = useAuth0();

    // Get POI details
    useEffect(() => {
        async function getEstablishment() {
            let establishment = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.establishments}/${establishmentID}`,
                getAccessTokenSilently,
                loginWithRedirect
            );

            setEstablishment(establishment);
        }

        getEstablishment();
    }, [establishmentID, getAccessTokenSilently, loginWithRedirect]);

    return (
        <div>
            {establishment ? <Establishment {...establishment} /> : <p>Loading details...</p>}
            <Link className="App-link" to="/list/establishment">
                Back
            </Link>
        </div>
    );
}




