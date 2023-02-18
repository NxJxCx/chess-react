import { Outlet } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import React, { lazy } from 'react';

const ChessBoard = lazy(() => import('./ChessBoard'));

const LoggedIn = function(props) {
  const cookies = props.cookies;
  return (
    <>
      <div className="h1 bg-dark text-light pb-3">
        Welcome, {cookies.sessionIGN}!
      </div>
      <ChessBoard />
    </>
  );
}

const NotLoggedIn = function(props) {
  return (
    <div className="App-header">
      <div className="fw-bold h1 text-light">
        <a href="/login" className="text-decoration-none text-warning">Play now!</a>
      </div>
    </div>
  )
}

function App() {
  const cookies = useCookies(['sessionID', 'sessionIGN']);
  return (
    <>
      { window.location.pathname === "/" ? (
        cookies[0].sessionID && cookies[0].sessionIGN ?
        <LoggedIn cookies={cookies[0]} setCookie={cookies[1]} removeCookie={cookies[2]} /> :
        <NotLoggedIn cookies={cookies} setCookie={cookies[1]} removeCookie={cookies[2]} />
      ) : (<></>) }
      <Outlet />
    </>
  );
}

export default App;