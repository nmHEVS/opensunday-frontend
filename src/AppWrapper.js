import React from 'react';
import App from './App';
/* Import the ThemeContext from ThemeContext.js */
import { ThemeContext } from './ThemeContext';

/* AppWrapper to keep the Context value */
class AppWrapper extends React.Component {
    /* Initialize state with a default theme */
    constructor() {
        super();
        this.state = { theme: 'dark' };
    }

    /* Toggle theme method */
    toggleTheme = () => {
        this.setState((prevState) => ({
            theme: prevState.theme === 'dark' ? 'light' : 'dark',
        }));
    };

    /*
    Render our App component, wrapped by a ThemeContext Provider:
    The value contains the theme (coming from state) and the
    toggleTheme method allowing consumers of the context to
    update the current theme.
     */
    render() {
        return (
            <ThemeContext.Provider
                value={{ theme: this.state.theme, toggleTheme: this.toggleTheme }}
            >
                <App />
            </ThemeContext.Provider>
        );
    }
}

export default AppWrapper;
