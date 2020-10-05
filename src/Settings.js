import React, { useState, useContext } from "react";
import "./App.css";
import { ThemeContext, themes } from './ThemeContext';

export function Settings() {
    let themeContext = useContext(ThemeContext);

    return (
        <>
            {/* Render a form allowing to add a new book to the list */}
            <h2 style={{color: themes[themeContext.theme].foreground}}>Settings</h2>
        </>
    );
}

