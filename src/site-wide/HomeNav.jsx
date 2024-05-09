import { Alert, Button, Container, Nav, NavDropdown, Navbar, Toast, ToastContainer } from "react-bootstrap";
import { Link, Outlet, useResolvedPath } from "react-router-dom";

import useSpinner from '../hooks/UseSpinner'

import crest from '../assets/uw-crest.svg'
import { useState } from "react";
import SpinnerContext from "../contexts/SpinnerContext";
import AnnouncementToast from "./components/AnnouncementToast";
import ToastsContext from "../contexts/ToastsContext";

const HomeNav = (props) => {
    const currentPath = useResolvedPath().pathname;

    const [toasts, setToasts] = useState([])
    const [cookieWaiver, setCookieWaiver] = useState()
    const [justDismissed, setJustDismissed] = useState(false);

    if (cookieWaiver !== JSON.parse(localStorage.getItem("cookieWaiver"))) {
        setCookieWaiver(JSON.parse(localStorage.getItem("cookieWaiver")))
    }

    const removeToast = (delToastIAT) => {
        setToasts(oldToasts => oldToasts.filter(iToast => iToast.iat !== delToastIAT))
    }

    const addToast = (toast) => {
        setToasts(oldToasts => [...oldToasts, { ...toast, iat: new Date().getTime() }])
    }

    const spinner = useSpinner({
        component: <Outlet />,
        initialState: false
    });

    const dismissCookie = () => {
        if (localStorage.getItem("cookieWaiver") === "false") {
            addToast({
                title: "Cookies Enabled",
                body: `You have re-enabled cookies for CS571. BadgerAuth is available.`,
                variant: "success",
                lifespan: 15
            })
            localStorage.removeItem("cookieWaiver")
            setCookieWaiver(null);
        } else {
            localStorage.setItem("cookieWaiver", "true");
            setCookieWaiver(true);
        }

    }

    const banCookie = async () => {
        localStorage.setItem("cookieWaiver", "false");
        setCookieWaiver(false);
        await fetch("https://cs571.org/api/auth/remove-cs571-bid-cookie", {
            method: "DELETE",
            credentials: "include"
        })
        await fetch('https://cs571.org/api/auth/remove-cs571-badgerauth-cookie', {
            method: "DELETE",
            credentials: "include"
        })
        addToast({
            title: "Cookies Disabled",
            body: `You have disabled cookies for CS571. BadgerAuth is no longer available.`,
            variant: "danger",
            lifespan: 15
        })
    }

    const doJustDismiss = () => {
        setJustDismissed(true);
    }

    return <div>
        <Navbar sticky="top" collapseOnSelect expand="md" bg="dark" variant="dark">
            <Container style={{ marginLeft: "0.5rem" }}>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Brand as={Link} to="/">
                    <img
                        alt="UW Logo"
                        src={crest}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />{' '}
                    CS571 @ UW-Madison
                </Navbar.Brand>
                <Navbar.Collapse id="responsive-navbar-nav" className="me-auto">
                    <Nav>
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        {
                            cookieWaiver === false ? <></> : <>
                                <Nav.Link as={Link} to="/auth/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/auth">Manage BadgerIDs</Nav.Link>
                            </>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        {/* <Alert variant="warning"><strong>Planned Outage </strong> <a target="_blank" href="https://cs571.org/">cs571.org</a> will be unavailable on Wednesday, April 3rd from 7-10 pm CT for planned maintenance. The website and APIs will be unresponsive during this time.</Alert> */}
        <div style={{ margin: "1rem" }}>
            <ToastsContext.Provider value={[toasts, addToast]}>
                <SpinnerContext.Provider value={spinner}>
                    {spinner.display()}
                </SpinnerContext.Provider>
            </ToastsContext.Provider>
        </div>
        <ToastContainer position="bottom-end" className="p-3" style={{ position: "fixed" }}>
            {
                toasts.map((toast, i) => <AnnouncementToast key={toast.iat} {...toast} removeToast={removeToast} />)
            }
        </ToastContainer>
        {
            !justDismissed && !cookieWaiver && <ToastContainer position="bottom-start" className="p-3" style={{ position: "fixed" }}>
                {
                    (cookieWaiver === undefined || cookieWaiver === null) ?
                        <Toast bg={"light"} animation={true} show={!justDismissed} onClose={doJustDismiss}>
                            <Toast.Header>
                                <strong className="me-auto">Cookie Notice 🍪</strong>
                            </Toast.Header>
                            <Toast.Body>CS571 uses cookies to store your Badger ID and perform other essential operations. By continuing to use the website, you consent to this notice.</Toast.Body>
                            <div style={{ margin: "0.5rem" }}>
                                <Button onClick={dismissCookie}>Don't Show Me Again</Button>
                                <Button onClick={banCookie} style={{ marginLeft: "0.25rem" }} variant="neutral">Disallow</Button>
                            </div>
                        </Toast>
                        :
                        <Toast bg={"light"} animation={true} show={!justDismissed} onClose={doJustDismiss}>
                            <Toast.Header>
                                <strong className="me-auto">Disabled Cookie Notice ❗🍪</strong>
                            </Toast.Header>
                            <Toast.Body>Cookies have been disabled. You no longer have access to BadgerAuth.</Toast.Body>
                            <div style={{ margin: "0.5rem" }}>
                                <Button onClick={dismissCookie} style={{ marginLeft: "0.25rem" }}>Enable Cookies</Button>
                            </div>
                        </Toast>
                }
            </ToastContainer>
        }

    </div>
}

export default HomeNav;