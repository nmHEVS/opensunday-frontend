import React, {useState, useContext} from "react";
import "./App.css";
import {useAuth0} from "@auth0/auth0-react";
import request from "./utils/request";
import endpoints from "./endpoints";
import Loading from "./components/Loading";
import {BrowserRouter, Link, Switch, Route} from "react-router-dom";
import LocationDetails from "./pages/LocationDetails";
import {EstablishmentForm} from './EstablishmentForm';
import {EstablishmentsList} from './EstablishmentsList';
import {Settings} from "./Settings";
import {ThemeContext, themes} from './ThemeContext';
import EstablishmentDetails from "./pages/EstablishmentDetails";
// import {Nav} from "react-bootstrap";
import Navbar, {Nav} from "react-bootstrap";
import NavigationBar from "./NavigationBar";
import OurMap from "./OurMap";


function App() {
    let [locations, setLocations] = useState([]);
    let [establishments, setEstablishments] = useState([]);
    let themeContext = useContext(ThemeContext);

    let {
        loading,
        loginWithRedirect,
        logout,
        getAccessTokenSilently,
        isAuthenticated,
    } = useAuth0();

    //Handle Locations
    let handleLocationsClick = async (e) => {
        e.preventDefault();
        let locations = await request(
            `${process.env.REACT_APP_SERVER_URL}${endpoints.locations}`,
            getAccessTokenSilently,
            loginWithRedirect
        );

        if (locations && locations.length > 0) {
            console.log(locations);
            setLocations(locations);
        }
    };

    let handleLoginClick = async (e) => {
        e.preventDefault();
        await request(`${process.env.REACT_APP_SERVER_URL}${endpoints.locations}`,
            getAccessTokenSilently,
            loginWithRedirect
        );
    }

    let handleLogoutClick = async (e) => {
        e.preventDefault();
        /*
        returnTo parameter is necessary because multiple
        apps use the same authentication backend
        */
        logout({returnTo: window.location.origin});
    };

    if (loading) {
        return <Loading/>;
    }

    let addEstablishment = (establishment) => {
        setEstablishments((prevEstablishments) => [establishment, ...prevEstablishments]);
    };

    return (
        <div className="App">
            <BrowserRouter>
                <NavigationBar authenticator={isAuthenticated ? (
                    <Nav.Link
                        href="#"
                        onClick={handleLogoutClick}
                    >Log out</Nav.Link>
                ) : (
                    <Nav.Link
                        href="#"
                        onClick={handleLoginClick}
                    >Log in</Nav.Link>
                )}/>
                <header className="App-header" style={{background: themes[themeContext.theme].background}}>
                    <h1 style={{color: themes[themeContext.theme].foreground}}>OpenSunday</h1>
                    <br/>
                    <Switch>
                        <Route path="/location/:id" component={LocationDetails}/>
                    </Switch>
                    <Switch>
                        <Route
                            path="/list/establishment"
                            render={() => (<EstablishmentsList/>)}
                        />
                        <Route path="/establishment/:id" component={EstablishmentDetails}/>
                    </Switch>
                    <Route
                        path="/settings"
                        render={() => <Settings/>}
                    />
                    <Route path="/new/establishment" render={() => <EstablishmentForm/>}/>
                    <Route exact path="/" component={OurMap}/>
                </header>
            </BrowserRouter>
        </div>
    )
}

export default App;