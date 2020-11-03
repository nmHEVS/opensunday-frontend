import {useAuth0} from "@auth0/auth0-react";
import React, {useContext, useEffect, useState} from "react";
import {ThemeContext, themes} from "../ThemeContext";

function Profile (){
    //let [posts, setPosts] = useState([]);
    let { user, isAuthenticated, isLoading} = useAuth0();
    let themeContext = useContext(ThemeContext);
    if (isLoading) {
        return <div>Loading ...</div>;
    }
    return (
        isAuthenticated && (
            <div style={{color: themes[themeContext.theme].foreground}}>
                <img src={user.picture} alt={user.name} />
                <h2>{user.nickname}</h2>
                <p>{user.email}</p>
            </div>
        )
    );
};

export default Profile;