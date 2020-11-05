import React, {useState, useContext, useEffect} from "react";
import "./App.css";
import { ThemeContext, themes } from './ThemeContext';
import Profile from "./components/Profile";
import {Link} from "react-router-dom";
import request from "./utils/request";
import endpoints from "./endpoints.json";
import {useAuth0} from "@auth0/auth0-react";

export function Settings() {
    let themeContext = useContext(ThemeContext);
    let [isAdmin, setIsAdmin] = useState(false);
    let {
        user,
        loginWithRedirect,
        getAccessTokenSilently,
    } = useAuth0();

    useEffect(() => {
        //Get if user is an admin or not
        async function getUserIdByEmail(user) {
            let userConnected = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.userByEmail}${user.name}`,
                getAccessTokenSilently,
                loginWithRedirect
            );

            if (userConnected.userTypeId == 1) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        }
        getUserIdByEmail(user);
    }, []);

    return (
            <div style={{color: themes[themeContext.theme].foreground}}>
                <h2 style={{color: themes[themeContext.theme].foreground}}>Settings</h2>
                <hr></hr>
                <switch
                    type="button"
                    title="Switch Theme"
                    onClick={themeContext.toggleTheme}
                >
                    <span>💡</span>
                </switch>
                <br/>
                {
                    isAdmin ?
                        <Link className="App-link" to="/user-management">
                            Users managements
                        </Link>
                        :
                        <span/>
                }
                <br/>
                <br/>
                <h2>My account</h2>
                <hr></hr>
                <Profile></Profile>
            </div>
    );
}

