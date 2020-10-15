import React, { useState, useContext } from "react";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import request from "./utils/request";
import endpoints from "./endpoints";
import * as ReactBootStrap from "react-bootstrap";
import Loading from "./components/Loading";
import { BrowserRouter, Link, Switch, Route } from "react-router-dom";
import LocationDetails from "./pages/LocationDetails";
import { EstablishmentForm } from './EstablishmentForm';
import {EstablishmentsList} from './EstablishmentsList';
import { Settings} from "./Settings";
import { ThemeContext, themes } from './ThemeContext';





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

  //Handle Establishments
  let handleEstablishmentsClick = async (e) => {
    e.preventDefault();
    let establishments = await request(
        `${process.env.REACT_APP_SERVER_URL}${endpoints.establishment}`,
        getAccessTokenSilently,
        loginWithRedirect
    );

    if (establishments && establishments.length > 0) {
      console.log(establishments);
      setEstablishments(establishments);
    }
  };




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
    await request (`${process.env.REACT_APP_SERVER_URL}${endpoints.locations}`,
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
    logout({ returnTo: window.location.origin });
  };

  if (loading) {
    return <Loading />;
  }

  let addEstablishment = (establishment) => {
    setEstablishments((prevEstablishments) => [establishment, ...prevEstablishments]);
  };

  return (
      <div className="App">
        <ReactBootStrap.Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <ReactBootStrap.Navbar.Brand href="/home">Home</ReactBootStrap.Navbar.Brand>
          <ReactBootStrap.Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <ReactBootStrap.Navbar.Collapse id="responsive-navbar-nav">
            <ReactBootStrap.Nav className="mr-auto">
              <ReactBootStrap.Nav.Link href="/map">Map</ReactBootStrap.Nav.Link>
              <ReactBootStrap.NavDropdown title="EstablishmentDetails" id="collasible-nav-dropdown">
                <ReactBootStrap.NavDropdown.Item href="/establishment/list">List</ReactBootStrap.NavDropdown.Item>
                <ReactBootStrap.NavDropdown.Item href="/establishment/new">New</ReactBootStrap.NavDropdown.Item>
              </ReactBootStrap.NavDropdown>
            </ReactBootStrap.Nav>
            <ReactBootStrap.Nav.Link href="/settings">Settings</ReactBootStrap.Nav.Link>

            <ReactBootStrap.Nav>
              {/*Login/Logout switch*/}
              {isAuthenticated ? (
                  <ReactBootStrap.Nav.Link
                      className="App-link Logout-link"
                      href="#"
                      onClick={handleLogoutClick}
                  >Log out</ReactBootStrap.Nav.Link>
              ) : (
                  <ReactBootStrap.Nav.Link
                      className="App-link Logout-link"
                      href="#"
                      onClick={handleLoginClick}
                  >Log in</ReactBootStrap.Nav.Link>
              )}
              {/*<ReactBootStrap.Nav.Link href="#account">Account</ReactBootStrap.Nav.Link>*/}
            </ReactBootStrap.Nav>
          </ReactBootStrap.Navbar.Collapse>
        </ReactBootStrap.Navbar>
        <header className="App-header" style={{background: themes[themeContext.theme].background}}>
          {/*{isAuthenticated && (*/}
          {/*  <a*/}
          {/*    className="App-link Logout-link"*/}
          {/*    href="#"*/}
          {/*    onClick={handleLogoutClick}*/}
          {/*  >*/}
          {/*    Logout*/}
          {/*  </a>*/}
          {/*)}*/}
          <h1 style={{color: themes[themeContext.theme].foreground}}>OpenSunday</h1>
          <br />
          <BrowserRouter>
            <Switch>
              <Route
                  path="/"
                  exact
                  render={() => (
                      <>
                        <a
                            className="App-link"
                            href="#"
                            onClick={handleLocationsClick}
                        >
                          Get Locations
                        </a>
                        {locations && locations.length > 0 && (
                            <ul className="Locations-List">
                              {locations.map((location) => (
                                  <li key={location.id}>
                                    <Link
                                        className="App-link"
                                        to={`/location/${location.id}`}
                                    >
                                      {location.npa} {location.city}
                                    </Link>
                                  </li>
                              ))}
                            </ul>
                        )}
                      </>
                  )}
              />
              <Route path="/location/:id" component={LocationDetails} />
            </Switch>
            {/* Renders a Route that will render a BookForm and pass it the */}
            <Route
                path="/establishment/new"
                // render={() => <EstablishmentForm addEstablishment={addEstablishment()} />}
                render={() => <EstablishmentForm />}
            />
            <Route
                path="/establishment/list"

                render={() =>(
                    <>
                      <h2 style={{color: themes[themeContext.theme].foreground}}>List of Establishments</h2>
                      <button
                          onClick={handleEstablishmentsClick}
                      >
                        Get Establishments
                      </button>
                      <ul className="EstablishmentsList">
                        {establishments.map((establishment) => (
                            <li key={establishment.id}>
                              <Link
                                  className="App-link"
                                  to={`/establishment/${establishment.id}`}
                              >
                                {establishment.type} - {establishment.name}
                              </Link>
                            </li>
                        ))}
                      </ul>
                    </>)}
            />
            <Route
                path="/settings"
                render={() => <Settings />}
            />
          </BrowserRouter>
        </header>
      </div>
  );
}

export default App;
