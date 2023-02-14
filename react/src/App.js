import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import './App.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';
import Spinner from 'react-bootstrap/Spinner';

const LoginPage = lazy(() => import('./components/LoginPage'));
const SignupPage = lazy(() => import('./components/SignupPage'));

const Header = () => {
  return (
    <header className="header">
      <Navbar sticky="top" bg="dark" expand="md" variant="dark" collapseOnSelect>
        <Container>
          <Navbar.Brand href="home" className="mb-0 h1">Chess NJC</Navbar.Brand>
          <Navbar.Toggle aria-controls="headerLinks" />
          {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarController" aria-controls="navbarController" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button> */}
          <Navbar.Collapse id="headerLinks">
          {/* <div className="collapse navbar-collapse" id="navbarController"> */}
            <Nav className="me-auto">
            {/* <ul className="navbar-nav me-auto"> */}
              <Nav.Link href="login" active={window.location.pathname === "/login"} >Login</Nav.Link>
              {/* <li className="nav-item">
                <a className={"nav-link" + (window.location.pathname === "/login"? " active": "")} href="login">Login</a>
              </li> */}
              <Nav.Link href="signup" active={window.location.pathname === "/signup"} >Sign Up</Nav.Link>
              {/* <li className="nav-item" >
                <a className={"nav-link" + (window.location.pathname === "/signup"? " active": "")} href="signup">Sign Up</a>
              </li> */}
            {/* </ul> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

const ErrorPage = () => {
  return (
    <div className="App-header">
      <h1 className="h1">
        ERROR 404!
      </h1>
    </div>
  );
}

const HomePage = () => {
  return (
    <>
      <Outlet />
    </>
  );
}

const LoadingScreen = () => {
  return (
    <div className="App-header d-flex">
      <div className="flex-column align-items-center justify-content-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Suspense fallback={<LoadingScreen />} >
          <Routes>
            <Route exact path="/" element={<HomePage />} >
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
              <Route path="*" element={<ErrorPage />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
