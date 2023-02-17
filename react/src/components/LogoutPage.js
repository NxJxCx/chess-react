import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Spinner from 'react-bootstrap/Spinner';

function App() {
  const {cookies, removeCookie} = useCookies(['sessionID', 'sessionIGN']);
  useEffect(() => {
    if (cookies.sessionID)
      removeCookie('sessionID');
    if (cookies.sessionIGN)
      removeCookie('sessionIGN');
    return () => { window.location.href = '/login' };
  }, [cookies.sessionID, cookies.sessionIGN, removeCookie]);
  return (
    <div className="App-header d-flex">
      <div className="flex-column align-items-center justify-content-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    </div>
  )
}

export default App;