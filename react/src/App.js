import React, { lazy, Suspense, useEffect } from 'react';
import { RouterProvider, Route, Outlet, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import './App.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';
import Spinner from 'react-bootstrap/Spinner';
import { CookiesProvider, useCookies } from 'react-cookie';

const LoginPage = lazy(() => import('./components/LoginPage'));
const SignupPage = lazy(() => import('./components/SignupPage'));
const ErrorPage = lazy(() => import('./components/ErrorPage'));
const LogoutPage = lazy(() => import('./components/LogoutPage'));

const Header = () => {
  const [cookies, setCookies] = useCookies(['sessionID', 'sessionIGN']);
  useEffect(() => {
    let t = setInterval(() => {
      if (cookies.sessionID && cookies.sessionIGN) {
        setCookies('sessionID', cookies.sessionID, { expires: new Date((60000 * 60) + Date.now()) });
        setCookies('sessionIGN', cookies.sessionIGN, { expires: new Date((60000 * 60) + Date.now()) });
      }
    }, 3000);
    return () => clearInterval(t); 
  });
  return (
    <header className="header">
      <Navbar sticky="top" bg="dark" expand="md" variant="dark" collapseOnSelect>
        <Container>
          <Navbar.Brand href="/" className="mb-0 h1">Chess NJC</Navbar.Brand>
          <Navbar.Toggle aria-controls="headerLinks" />
          {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarController" aria-controls="navbarController" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button> */}
          <Navbar.Collapse id="headerLinks">
          {/* <div className="collapse navbar-collapse" id="navbarController"> */}
            <Nav className="ms-auto">
            {/* <ul className="navbar-nav me-auto"> */}
            {cookies.sessionID && cookies.sessionIGN ? (
              <>
              <Nav.Link href="logout" active={window.location.pathname === "/logout"} >Logout</Nav.Link>
              </>
            ) : (<>
              <Nav.Link href="login" active={window.location.pathname === "/login"} >Login</Nav.Link>
              {/* <li className="nav-item">
                <a className={"nav-link" + (window.location.pathname === "/login"? " active": "")} href="login">Login</a>
              </li> */}
              <Nav.Link href="signup" active={window.location.pathname === "/signup"} >Sign Up</Nav.Link>
              {/* <li className="nav-item" >
                <a className={"nav-link" + (window.location.pathname === "/signup"? " active": "")} href="signup">Sign Up</a>
              </li> */}
            </>)}
            {/* </ul> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

const HomePage = () => {
  const [cookies] = useCookies(['sessionID', 'sessionIGN']);
  return (
    <>
      { window.location.pathname === "/" ? (
        <div className="App-header">
          <div className="h1">Welcome, {cookies.sessionIGN}!</div>
        </div>
      ) : undefined }
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

const Router = createBrowserRouter(createRoutesFromElements(
  <Route exact path="/" element={<HomePage />} >
    <Route path="login" element={<LoginPage />} />
    <Route path="signup" element={<SignupPage />} />
    <Route path="logout" element={<LogoutPage />} />
    <Route path="*" element={<ErrorPage />} />
  </Route>
));

function App() {
  return (
    <CookiesProvider>
    <div className="App">
      <Header />
      <Suspense fallback={<LoadingScreen />} >
        <RouterProvider router={Router} />
      </Suspense>
    </div>
    </CookiesProvider>
  );
}

export default App;
