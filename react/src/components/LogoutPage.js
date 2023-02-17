import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Spinner from 'react-bootstrap/Spinner';

function App() {
  const cookies = useCookies(['sessionID', 'sessionIGN']);
  useEffect(() => {
    if (cookies[0].sessionID)
      cookies[2]('sessionID');
    if (cookies[0].sessionIGN)
      cookies[2]('sessionIGN');
    return () => { window.location.href = '/login'; };
  }, [cookies]);
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