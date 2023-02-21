import './App.css';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';

import Header from './Header';

const HomePage = lazy(() => import('./components/HomePage'));
const LoginPage = lazy(() => import('./components/LoginPage'));
const SignupPage = lazy(() => import('./components/SignupPage'));
const ErrorPage = lazy(() => import('./components/ErrorPage'));
const LogoutPage = lazy(() => import('./components/LogoutPage'));
const ChatRooms = lazy(() => import('./components/ChatRooms'));

const LoadingScreen = () => (
  <div className="App-header d-flex">
    <div className="flex-column align-items-center justify-content-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  </div>
);


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
            <Route path="/chatroom" element={<ChatRooms />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
       </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
