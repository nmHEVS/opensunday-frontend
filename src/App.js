import React, { useState, useContext } from "react";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import request from "./utils/request";
import endpoints from "./endpoints";
import Loading from "./components/Loading";
import { BrowserRouter, Link, Switch, Route } from "react-router-dom";
import LocationDetails from "./pages/LocationDetails";
import { ThemeContext, themes } from './ThemeContext';
import Map from './Map';

function App() {
  let [locations, setLocations] = useState([]);

  /* Use Theme Context (with a hook) */
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

  return (
    <div className="App">
      <header className="App-header">
        {isAuthenticated && (
          <a
            className="App-link Logout-link"
            href="#"
            onClick={handleLogoutClick}
          >
            Logout
          </a>
        )}
        <h1 style={{ color: themes[themeContext.theme].foreground }}>Welcome on OpenSunday</h1>
        <h2>Find how to pass this dull day !</h2>
        <br/>
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
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
