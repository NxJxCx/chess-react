import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap';
// import NavDropdown from 'react-bootstrap/NavDropdown';
import Spinner from 'react-bootstrap/Spinner';
import { useCookies } from 'react-cookie';

const HomePage = lazy(() => import('./components/HomePage'));
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
          <LinkContainer to="/">
            <Navbar.Brand className="mb-0 h1">Chess NJC</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="headerLinks" />
          {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarController" aria-controls="navbarController" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button> */}
          <Navbar.Collapse id="headerLinks">
            <Nav className="ms-auto">
            {cookies.sessionID && cookies.sessionIGN ? (
              <Nav.Item>
              <LinkContainer to="/logout">
              <Nav.Link>Logout</Nav.Link>
              </LinkContainer>
              </Nav.Item>
            ) : (<>
              <Nav.Item>
              <LinkContainer to="/login">
              <Nav.Link>Login</Nav.Link>
              </LinkContainer>
              </Nav.Item>
              <Nav.Item>
              <LinkContainer to="/signup">
              <Nav.Link>Sign Up</Nav.Link>
              </LinkContainer>
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
    <BrowserRouter>
      <div className="App">
        <Header />
        <Suspense fallback={<LoadingScreen />} >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
       </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
