import React, { useState, useContext } from "react";
import "./App.css";
import { ThemeContext, themes } from './ThemeContext';
import Profile from "./components/Profile";

export function Settings() {
    let themeContext = useContext(ThemeContext);

    return (
            <>
                <h2 style={{color: themes[themeContext.theme].foreground}}>Settings</h2>
                <switch
                    type="button"
                    title="Switch Theme"
                    onClick={themeContext.toggleTheme}
                >
                    <span>💡</span>
                </switch>
                <Profile></Profile>
            </>
    );
}

