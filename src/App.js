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
import { ThemeContext, themes } from './ThemeContext';
import Map from './Map';

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
              <ReactBootStrap.NavDropdown title="Establishment" id="collasible-nav-dropdown">
                <ReactBootStrap.NavDropdown.Item href="/establishment/list">List</ReactBootStrap.NavDropdown.Item>
                <ReactBootStrap.NavDropdown.Item href="/establishment/new">New</ReactBootStrap.NavDropdown.Item>
              </ReactBootStrap.NavDropdown>
            </ReactBootStrap.Nav>
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
        <header className="App-header">
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
                                      {location.name}
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
            <Route path="/establishment/new" render={() => <EstablishmentForm />}/>
            <Route exact path="/map" component={Map} />
          </BrowserRouter>
      </header>

    </div>
  )
}

export default App;
