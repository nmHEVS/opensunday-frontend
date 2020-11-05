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
        loginWithRedirect,
        getAccessTokenSilently,
    } = useAuth0();

    useEffect(() => {
        async function getUsers() {
            let users = await request(
                `${process.env.REACT_APP_SERVER_URL}${endpoints.users}`,
                getAccessTokenSilently,
                loginWithRedirect
            );
            await setUserList(users);
        }

        getUsers();
    }, [userList]);

    let putUser = {
        id: '',
        pseudo: '',
        email: '',
        userTypeId: ''
    };

    //Onclick to switch user type
    async function switchType(user, index) {
        let token = await getAccessTokenSilently();
        putUser.id = user.id;
        putUser.pseudo = user.pseudo;
        putUser.email = user.email;
        console.log("before " + userList[index].userTypeId);
        if(user.userTypeId === 1){
            putUser.userTypeId = 2;
            userList[index].userTypeId = 2;
        }else{
            putUser.userTypeId = 1;
            userList[index].userTypeId = 1;
        }
        await fetch(`${process.env.REACT_APP_SERVER_URL}${endpoints.users}${user.id}`, {
            method: 'PUT',
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(putUser),
        });
        console.log("after " + userList[index].userTypeId);
    }

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
                                <TableCell><b>ID</b></TableCell>
                                <TableCell><b>Pseudo</b></TableCell>
                                <TableCell align="left"><b>Email</b></TableCell>
                                <TableCell align="left"><b>User type</b></TableCell>
                                <TableCell align="center"><b>Switch type</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {userList.map((user, index) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        {user.id}
                                    </TableCell>
                                    <TableCell>
                                        {user.pseudo}
                                    </TableCell>
                                    <TableCell>
                                        {user.email}
                                    </TableCell>
                                    <TableCell align="center">
                                        {user.userTypeId}
                                    </TableCell>
                                    <TableCell align="center">
                                        {
                                            user.userTypeId === 2 ?
                                                <Button
                                                    id="adminButton"
                                                    onClick={() => switchType(user, index)}
                                                >
                                                    Make admin
                                                </Button>
                                                :
                                                <Button
                                                    id="userButton"
                                                    onClick={() => switchType(user, index)}
                                                >
                                                    Make user
                                                </Button>
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
}

