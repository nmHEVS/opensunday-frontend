import React, {useState, useContext, useEffect} from "react";
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
import Navbar, {Nav} from "react-bootstrap";
import NavigationBar from "./NavigationBar";
import OurMap from "./OurMap";
import Profile from "./components/Profile";
import Error404 from "./pages/Error404";


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



// post user method



    // useEffect(()=>{
    //
    //
    //     async function getUser() {
    //         let users = await request(
    //             `${process.env.REACT_APP_SERVER_URL}${endpoints.users}`,
    //             getAccessTokenSilently,
    //             loginWithRedirect
    //         );
    //
    //         if (users && users.length > 0) {
    //             console.log(users);
    //             setUsers(users);
    //         }
    //
    //
    //     }
    //
    //     async function postUsers(values) {
    //
    //         // let response = await fetch(`${process.env.REACT_APP_SERVER_URL}${endpoints.users}`,
    //         //     {
    //         //         method: 'POST',
    //         //         headers: {
    //         //             'Content-Type': 'application/json',
    //         //             'Authorization': `${endpoints.bearerToken}`
    //         //         },
    //         //         body: JSON.stringify(values),
    //         //     });
    //
    //
    //         // let data = await response.json();
    //         // return data;
    //
    //
    //     }
    //
    //     async function postUser(){
    //         const str = user.name;
    //         const vr = str.substring(0, 5);
    //         const ps = '12233';
    //         const usType = 1;
    //         console.log(user.name)
    //
    //         let postUser = {
    //             name: vr,
    //             surname: user.nickname,
    //             username: user.name,
    //             password: ps,
    //             userTypeId: usType,
    //
    //         };
    //
    //         try {
    //             let user = await postUsers(postUser);
    //             //console.log('posted user name', user.name)
    //         }catch(err){
    //             console.error('error posting user', err)
    //         }
    //
    //
    //     }
    //
    //       getUser();
    //
    //     if(isAuthenticated) {
    //
    //         for(let i=0; i<users.length;i++) {
    //             if(users[i].username == user.name){
    //                 //console.log(users[i].username)
    //
    //                 //console.log("User exists already")
    //             }else{
    //
    //
    //             postUser();
    //
    //
    //             }
    //         }
    //
    //
    //
    //     }
    //
    //
    // },[isAuthenticated]);



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
                    >{user.nickname} - Log out</Nav.Link>
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
                    <Route path="/error404" render={() => <Error404/>}/>
                </header>
            </BrowserRouter>
        </div>
    )
}

export default App;


