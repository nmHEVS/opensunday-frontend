import React, {useState, useContext, useEffect} from "react";
import "./App.css";
import {ThemeContext, themes} from './ThemeContext';
import request from "./utils/request";
import endpoints from "./endpoints.json";
import {useAuth0} from "@auth0/auth0-react";
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from "@material-ui/core/Button";

export function UserManagement() {
    let themeContext = useContext(ThemeContext);
    const [userList, setUserList] = useState([]);
    let {
        user,
        loading,
        loginWithRedirect,
        logout,
        getAccessTokenSilently,
        isAuthenticated,
    } = useAuth0();

    useEffect(() => {
        async function getCurrentUserTypeId() {
            let users = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.users}`,
                getAccessTokenSilently,
                loginWithRedirect
            );
            console.log(users);
            setUserList(users);
        }

        getCurrentUserTypeId();
    }, []);

    return (
        <>
            <div style={{color: themes[themeContext.theme].foreground}}>
                <h2>
                    Users management
                </h2>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Pseudo</TableCell>
                                <TableCell align="right">Email</TableCell>
                                <TableCell align="right">Usertype</TableCell>
                                <TableCell align="right">Change</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {userList.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        {user.pseudo}
                                    </TableCell>
                                    <TableCell>
                                        {user.email}
                                    </TableCell>
                                    <TableCell>
                                        {user.userTypeId}
                                    </TableCell>
                                    <TableCell>
                                        {
                                            user.userTypeId === 2 ?
                                                <Button>
                                                    Make admin
                                                </Button>
                                                :
                                                <Button>
                                                    Make user
                                                </Button>
                                        }
                                    </TableCell>
                                    {/*<TableCell align="right">{user.calories}</TableCell>*/}
                                    {/*<TableCell align="right">{user.fat}</TableCell>*/}
                                    {/*<TableCell align="right">{user.carbs}</TableCell>*/}
                                    {/*<TableCell align="right">{user.protein}</TableCell>*/}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
}

