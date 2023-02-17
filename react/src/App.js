import React, { lazy, Suspense, useEffect } from 'react';
import { RouterProvider, Route, Outlet, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import './App.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';
import Spinner from 'react-bootstrap/Spinner';
import { useCookies } from 'react-cookie';

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
            <Nav className="ms-auto">
            {cookies.sessionID && cookies.sessionIGN ? (
              <Nav.Item>
              <Nav.Link href="logout" active={window.location.pathname === "/logout"} >Logout</Nav.Link>
              </Nav.Item>
            ) : (<>
              <Nav.Item>
              <Nav.Link href="login" active={window.location.pathname === "/login"} >Login</Nav.Link>
              </Nav.Item>
              <Nav.Item><Nav.Link href="signup" active={window.location.pathname === "/signup"} >Sign Up</Nav.Link>
              </Nav.Item>
              </>
            )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

const HomePage = () => {
  const cookies = useCookies(['sessionID', 'sessionIGN']);
  return (
    <>
      { window.location.pathname === "/" ? (
        <div className="App-header">
          <div className="fw-bold h1 text-light">{cookies[0].sessionID && cookies[0].sessionIGN ? (<>Welcome, {cookies[0].sessionIGN}!</>) : (<><a href="/login" className="text-decoration-none text-warning">Login now!</a></>)}</div>
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
    <div className="App">
      <Header />
      <Suspense fallback={<LoadingScreen />} >
        <RouterProvider router={Router} />
      </Suspense>
    </div>
  );
}

export default App;
