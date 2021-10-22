import React from 'react';
import { Navbar, Container, NavbarBrand } from 'react-bootstrap';
import "../CSS/nav.css";

function Nav(){

    return(
        <div>
            <Navbar expand="lg" variant="dark" bg="dark">
                <Container>
                    <Navbar.Brand href="/" className="nav-brand">Twitter Engine</Navbar.Brand>
                </Container>
            </Navbar>
        </div>
    )
}

export default Nav;