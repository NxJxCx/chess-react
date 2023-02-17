/* Login Page */
import React, { useState, useEffect } from 'react';
//import Session from 'react-session-api';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Card from 'react-bootstrap/Card';

const invalids = {
  usernameNotExists: "Username does not exist",
  invalidPassword: "Invalid Password",
}


function App() {
  const [userNameValue, setUserNameValue] = useState({value: ""});
  const [passwordValue, setPasswordValue] = useState({value: ""});
  const [errorMessage, setErrorMessage] = useState({ value: undefined }); 
  const [errMsg, setErrMsg] = useState(null);
  const onUserName = (e) => {
    setUserNameValue({ value: e.target.value });
  }
  const onPassword = (e) => {
    setPasswordValue({ value: e.target.value });
  }
  const onLogin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: get api
  }

  useEffect(() => {
    if (errMsg && errorMessage.value) {
      if (!errMsg.classList.contains("show"))
        errMsg.classList.add("show");
    }
  }, [errMsg, errorMessage]);

  return (
    <>
      <div className="App-header">
        <Container>
          <div className="mb-4 h1 fw-bold">
            Login
          </div>
          <div className="w-75 ms-auto me-auto">
          <div className="mb-3 collapse" ref={setErrMsg} >
            <Card className="ms-5 me-5 text-danger border border-danger">
              <Card.Body><Card.Subtitle>{errorMessage.value}</Card.Subtitle></Card.Body>
            </Card>
          </div>
          <Form noValidate onSubmit={onLogin} autoComplete="off">
            <Form.Group as={FloatingLabel} className="mb-3 ms-3 me-3 text-dark pt-2 fs-4"  controlId="usernameFloat" label="Username">
              <Form.Control type="text" autoComplete="off" name="username" placeholder="Username" value={userNameValue.value} onChange={onUserName} />
            </Form.Group>
            <Form.Group as={FloatingLabel} className="mb-3 ms-3 me-3 text-dark pt-2 fs-4"  controlId="passwordFloat" label="Password">
              <Form.Control type="password" name="password" placeholder="Password" value={passwordValue.value} onChange={onPassword} />
            </Form.Group>
            <div className="row mb-3 ms-3 me-3">
              <a href="recovery" className="text-decoration-none text-light fs-5">Forgot Password?</a>
            </div>
            <Form.Group className="mb-3 ms-3 me-3">
              <Button type="submit" variant="primary" className="mb-3 ps-4 pe-4">Login</Button>
            </Form.Group>
          </Form>
          </div>
          <hr />
          <a href="signup" className="m-3 btn btn-success">Sign Up Now!</a>
        </Container>
      </div>
    </>
  );
}

export default App;
