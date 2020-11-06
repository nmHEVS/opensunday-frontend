import React, {useState, useContext, useEffect} from "react";
import "./App.css";
import {useAuth0} from "@auth0/auth0-react";
import request from "./utils/request";
import endpoints from "./endpoints";
import Loading from "./components/Loading";
import {BrowserRouter, Link, Switch, Route} from "react-router-dom";
import {EstablishmentForm} from './pages/EstablishmentForm';
import {EstablishmentsList} from './pages/EstablishmentsList';
import {Settings} from "./pages/Settings";
import {ThemeContext, themes} from './ThemeContext';
import EstablishmentDetails from "./pages/EstablishmentDetails";
import Navbar, {Nav} from "react-bootstrap";
import NavigationBar from "./NavigationBar";
import OurMap from "./pages/OurMap";
import Error404 from "./pages/Error404";
import {UserManagement} from "./pages/UserManagement";

function App() {
    let [locations, setLocations] = useState([]);
    let [establishments, setEstablishments] = useState([]);
    let [users, setUsers] = useState([]);
    let themeContext = useContext(ThemeContext);
    let {
        user,
        loading,
        loginWithRedirect,
        logout,
        getAccessTokenSilently,
        isAuthenticated,
    } = useAuth0();
    let userExists = false;

    //Handle login click
    let handleLoginClick = async (e) => {
        e.preventDefault();
        await request(`${process.env.REACT_APP_SERVER_URL}${endpoints.locations}`,
            getAccessTokenSilently,
            loginWithRedirect
        );
    }
    //Handle logout click
    let handleLogoutClick = async (e) => {
        e.preventDefault();
        /*
        returnTo parameter is necessary because multiple
        apps use the same authentication backend
        */
        logout({returnTo: window.location.origin});
    };

    useEffect(() => {
        //Test if the user is authenticated
        if (isAuthenticated) {
            //Get the users list
            async function getUser() {
                let users = await request(
                    `${process.env.REACT_APP_SERVER_URL}${endpoints.users}`,
                    getAccessTokenSilently,
                    loginWithRedirect
                );
                if (users && users.length > 0) {
                    await setUsers(users);
                }
                await postUser(users);
            }
            getUser();
        }
    }, [isAuthenticated]);

    //Function to create the user object
    async function postUser(users) {
        if (isAuthenticated) {
            //New user is a User type (not an Admin)
            const usType = 2;

            //Declare the user variable
            let postUser = {
                pseudo: user.nickname,
                email: user.name,
                userTypeId: usType,
            };

            //Catch if an error occurs
            try {
                for (let i = 0; i < users.length; i++) {
                    if (users[i].email === user.name) {
                        // console.log("User exists already")
                        userExists = true;
                    }
                }
                if (!userExists) {
                    await postUsers(postUser);
                    // console.log('posted user name', user.name)
                }

            } catch (err) {
                console.error('error posting user', err)
            }
        }
    }

    //Function to post the user (call in postUser without s)
    async function postUsers(values) {
        let token = await getAccessTokenSilently();
        let response = await fetch(`${process.env.REACT_APP_SERVER_URL}${endpoints.users}`,
            {
                method: 'POST',
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

        let data = await response.json();
        return data;
    }

    //Loading display to wait for the data
    if (loading) {
        return <Loading/>;
    }

    return (
        <div className="App">
            <BrowserRouter>
                <NavigationBar authenticator={isAuthenticated ? (
                    <Nav.Link
                        href="#"
                        onClick={handleLogoutClick}
                    >{user.nickname} - Log out</Nav.Link>
                ) : (
                    <Nav.Link
                        href="#"
                        onClick={handleLoginClick}
                    >Log in</Nav.Link>
                )}/>
                <header className="App-header" style={{background: themes[themeContext.theme].background}}>
                    <Switch>
                        <Route
                            path="/list/establishment"
                            render={() => (<EstablishmentsList/>)}
                        />
                        <Route path="/establishment/:id" component={EstablishmentDetails}/>
                    </Switch>
                    <Route path="/settings" render={() => <Settings/>}/>
                    <Route path="/user-management" render={() => <UserManagement/>}/>
                    <Route path="/new/establishment" render={() => <EstablishmentForm/>}/>
                    <Route exact path="/" component={OurMap}/>
                    <Route path="/error404" render={() => <Error404/>}/>
                </header>
            </BrowserRouter>
        </div>
    )
}

export default App;


