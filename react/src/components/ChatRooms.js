import { useCookies, withCookies } from 'react-cookie';

const LoggedIn = function(props) {
  const cookies = props.cookies;
  return (
    <>
      <div className="h1 bg-dark text-light pb-3">
        Welcome, {cookies.sessionIGN}!
      </div>
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

function App(props) {
  const cookies = useCookies(['sessionID', 'sessionIGN']);
  return (
    <>
      { window.location.pathname === "/" ? (
        props.cookies.sessionID && props.cookies.sessionIGN ?
        <LoggedIn cookies={cookies[0]} setCookie={cookies[1]} removeCookie={cookies[2]} /> :
        <NotLoggedIn cookies={cookies[0]} setCookie={cookies[1]} removeCookie={cookies[2]} />
      ) : (<></>) }
    </>
  );
}

export default withCookies(App);
