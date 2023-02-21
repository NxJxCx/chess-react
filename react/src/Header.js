import React, { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap';
// import NavDropdown from 'react-bootstrap/NavDropdown';
import { useCookies } from 'react-cookie';

function App() {
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
          <Navbar.Collapse id="headerLinks">
            <Nav className="ms-auto">
            {cookies.sessionID && cookies.sessionIGN ? (<>
              <Nav.Item>
              <LinkContainer to="/chatroom">
                <Nav.Link>Chat Rooms</Nav.Link>
              </LinkContainer>
              </Nav.Item>
              <Nav.Item>
              <LinkContainer to="/logout">
              <Nav.Link>Logout</Nav.Link>
              </LinkContainer>
              </Nav.Item>
            </>) : (<>
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

export default App;
