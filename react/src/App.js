import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import './App.css';

const LoginPage = lazy(() => import('./components/LoginPage'));
const SignupPage = lazy(() => import('./components/SignupPage'));

const Header = () => {
  return (
    <header className="header navbar-top">
      <div className="container">
        <nav className="navbar navbar-expand-md">
          <a className="navbar-brand mb-0 h1" href="/">Chess NJC</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarController" aria-controls="navbarController" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarController">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className={"nav-link" + (window.location.pathname === "/login"? " active": "")} href="login">Login</a>
              </li>
              <li className="nav-item" >
                <a className={"nav-link" + (window.location.pathname === "/signup"? " active": "")} href="signup">Sign Up</a>
              </li>
            </ul>
            <div className="nav navbar-nav ms-auto">
            </div>
          </div>
        </nav>
      </div>
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
    <div className="App-header">
      <h1 className="h1">Loading...</h1>
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
