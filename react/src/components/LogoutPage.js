import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const cookies = useCookies(['sessionID', 'sessionIGN']);
  useEffect(() => {
    if (cookies[0].sessionID)
      cookies[2]('sessionID');
    if (cookies[0].sessionIGN)
      cookies[2]('sessionIGN');
    return () => setTimeout(() => { navigate("/login"); }, 500);
  }, [cookies, navigate]);
  return (
    <div className="App-header d-flex">
      <div className="flex-column align-items-center justify-content-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
          <LinkContainer to="/login"><Button className="visually-hidden" id="redirection" /></LinkContainer>
        </Spinner>
      </div>
    </div>
  )
}

export default App;
