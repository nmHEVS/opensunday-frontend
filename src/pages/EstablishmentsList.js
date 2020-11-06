import React, {useState, useContext, useEffect} from "react";
import "../App.css";
import { ThemeContext, themes } from '../ThemeContext';
import {Link} from "react-router-dom";
import request from "../utils/request";
import endpoints from "../endpoints.json";
import {useAuth0} from "@auth0/auth0-react";
import 'bootstrap/dist/css/bootstrap.min.css';
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";

export function EstablishmentsList(){
    let themeContext = useContext(ThemeContext);
    let [establishments, setEstablishments] = useState([]);
    let [establishmentsTypes, setEstablishmentsTypes] = useState([]);
    let {
        loginWithRedirect,
        getAccessTokenSilently,
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
                await setEstablishments(establishments);
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
                setEstablishmentsTypes(establishmentsTypes);
            }
        }
        getEstablishments();
        getEstablishmentsTypes();
    }, []);

    // get the list of establishments of the type selected
    let handleSelect = async (e) => {
        let establishmentTypeId = e.target.value;
        if (establishmentTypeId == 0 || null) {
            let establishments = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.establishments}`,
                getAccessTokenSilently,
                loginWithRedirect
            );
            if (establishments && establishments.length > 0) {
                console.log(establishments);
                await setEstablishments(establishments);
            }
        } else {
            let establishments = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.establishmentsByType}${establishmentTypeId}`,
                getAccessTokenSilently,
                loginWithRedirect
            );
            await setEstablishments(establishments);
        }
    }

    return(
        <div id="widthThirty" style={{color: themes[themeContext.theme].foreground}}>
            <h1>Establishment list</h1>
            <select
                id="establishmentType"
                name="establishmentType"
                type="text"
                onChange={handleSelect}
                placeholder="Establishment type"
            >
                <option value={0} >All</option>
                {establishmentsTypes.map((establishmentsType) => (
                    <option value={establishmentsType.id} key={establishmentsType.id}>
                        {establishmentsType.establishmentTypeName}
                    </option>
                ))}
            </select>
            <br/>
            <br/>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Establishment name</b></TableCell>
                            <TableCell align="center"><b>Show more</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {establishments
                            .map((establishment, index) => (
                                <TableRow key={establishment.id}>
                                    <TableCell>
                                        {establishment.name}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Link
                                            className="App-link"
                                            to={`/establishment/${establishment.id}`}
                                        >
                                            More
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );



}
