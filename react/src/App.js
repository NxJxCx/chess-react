import React, { lazy, Suspense } from 'react;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function Header(props) {
  return (
    <header className="header navbar-top">
      <div className="container">
        <nav className="navbar navbar-expand-md">
          <a className="navbar-brand mb-0 h1">Chess NJC</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#headerLinks" aria-controls="navbarController" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="headerLinks">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className={"nav-link" + (window.location.pathname === "/login"? " active": "")} href="login">Login</a>
              </li>
              <li className="nav-item" >
                <a className={"nav-link" + (window.location.pathname === "/signup"? " active": "")} href="">Sign Up</a>
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

function App() {
  return (
    <Router>
      <div className="App">
        <Header authdata={null} />
        <Routes>
          <Route exact path="/" element={} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
