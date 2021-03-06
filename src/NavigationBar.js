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

//Navigation bar display
const NavigationBar = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    return (
        <div id="navigationBar">
            <Navbar color="dark" dark expand="md">
                <NavbarBrand id="opensundayTitle" tag={Link} to="/">Opensunday</NavbarBrand>
                <NavbarText tag={Link} to="/">Map</NavbarText>
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
                    <NavbarText tag={Link} to="/settings">Settings</NavbarText>
                    <NavbarText>{props.authenticator}</NavbarText>
                </Collapse>

            </Navbar>
        </div>
    );
}

export default NavigationBar;
