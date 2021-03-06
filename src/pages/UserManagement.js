import React, {useState, useContext, useEffect} from "react";
import "../App.css";
import {ThemeContext, themes} from '../ThemeContext';
import request from "../utils/request";
import endpoints from "../endpoints.json";
import {useAuth0} from "@auth0/auth0-react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from "@material-ui/core/Button";

//User management page to pass user > admin and admin > user
export function UserManagement() {
    let themeContext = useContext(ThemeContext);
    const [userList, setUserList] = useState([]);
    let {
        loginWithRedirect,
        getAccessTokenSilently,
    } = useAuth0();

    useEffect(() => {
        //Get user list to update in live
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

    //Create user variable for the put
    let putUser = {
        id: '',
        pseudo: '',
        email: '',
        userTypeId: ''
    };

    //Onclick to switch user type
    async function switchType(user, index) {
        let token = await getAccessTokenSilently();
        //Set putUser with user given in parameter
        putUser.id = user.id;
        putUser.pseudo = user.pseudo;
        putUser.email = user.email;
        //Test if the user is an admin or not (admin=1/user=2)
        if(user.userTypeId === 1){
            putUser.userTypeId = 2;
            userList[index].userTypeId = 2;
        }else{
            putUser.userTypeId = 1;
            userList[index].userTypeId = 1;
        }
        //Request to put the user (to change the type)
        await fetch(`${process.env.REACT_APP_SERVER_URL}${endpoints.users}${user.id}`, {
            method: 'PUT',
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(putUser),
        });
    }

    //Search by Email filter
    const [search, setSearch] = useState("");
    function searchByEmail(e) {
        setSearch(e.target.value);
    }

    return (
        <>
            <div style={{color: themes[themeContext.theme].foreground}}>
                <h2>
                    Users management
                </h2>
                <input placeholder="Search by Email" name="firstName" onChange={searchByEmail}/>
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
                            {userList
                                .filter(email => email.email.includes(search))
                                .map((user, index) => (
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
                                            //Display a different button if the user of the list is an admin or not
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

