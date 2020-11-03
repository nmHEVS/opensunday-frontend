import {useAuth0} from "@auth0/auth0-react";
import React, {useEffect, useState} from "react";
import endpoints from "../endpoints.json";



function Profile (){

    //let [posts, setPosts] = useState([]);
    let { user, isAuthenticated, isLoading} = useAuth0();


    if (isLoading) {
        return <div>Loading ...</div>;
    }




    return (
        isAuthenticated && (
            <div>
                <img src={user.picture} alt={user.name} />
                <h2>{user.nickname}</h2>
                <p>{user.email}</p>
            </div>
        )
    );
};

export default Profile;