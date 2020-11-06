import React, {useContext, useEffect, useState} from "react";
import "./Error404.css";
import {ThemeContext, themes} from "../ThemeContext";
import Button from "@material-ui/core/Button";
import {useHistory} from "react-router-dom";

function Error404() {
    let themeContext = useContext(ThemeContext);
    let history = useHistory();

    //Handle the button
    function backToMap() {
        history.push("/");
    }

    //Error 404 display
    return (
        <div id="error404" style={{color: themes[themeContext.theme].foreground}}>
            <h1 id="h1Error">Whoops!</h1>
            <p id="pError">
                Something went wrong
            </p>
            <br/>
            <Button
                id="buttonDonation"
                variant="contained"
                color="secondary"
                onClick={backToMap}
            >
                Go back to the map
            </Button>
        </div>

    );
};

export default Error404;
