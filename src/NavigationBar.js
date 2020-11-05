import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText
} from 'reactstrap';

const NavigationBar = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    return (
        <div id="navigationBar">
            <Navbar color="dark" dark expand="md">
                <NavbarBrand  tag={Link} to="/">Map</NavbarBrand>
                <NavbarToggler onClick={toggle}/>
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="mr-auto" navbar>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                Establishment
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem tag={Link} to="/list/establishment">
                                    List
                                </DropdownItem>
                                <DropdownItem tag={Link} to="/new/establishment">
                                    New
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                    <NavbarText id="UM" tag={Link} to="/user-management">Users management</NavbarText>
                    <NavbarText tag={Link} to="/settings">Settings</NavbarText>
                    <NavbarText>{props.authenticator}</NavbarText>
                </Collapse>

            </Navbar>
        </div>
    );
}

export default NavigationBar;