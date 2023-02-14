/* Login Page */
import React, { useState, useEffect } from 'react';
//import Session from 'react-session-api';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

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
    setErrorMessage({value : "Success!"});
  }

  useEffect(() => {
    if (errMsg && errorMessage.value) {
      errMsg.classList.toggle("show");
    }
  }, [errMsg, errorMessage]);

  return (
    <>
      <div className="App-header">
        <Container>
          <div className="mb-5 collapse" ref={setErrMsg} >
            <Card className="text-danger" body>
              {errorMessage.value}
            </Card>
          </div>
          <Form onSubmit={onLogin} autocomplete="off">
            <Form.Group className="mb-3 ms-3 me-3">
              <Form.Label htmlFor="username">Username</Form.Label>
              <Form.Control type="text" autocomplete={false} name="username" placeholder="Username" value={userNameValue.value} onChange={onUserName} />
            </Form.Group>
            <Form.Group className="mb-3 ms-3 me-3">
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control type="password" name="password" placeholder="Password" value={passwordValue.value} onChange={onPassword} />
            </Form.Group>
            <Form.Group className="mb-3 ms-3 me-3">
              <Button type="submit" variant="primary">Login</Button>
            </Form.Group>
          </Form>
        </Container>
      </div>
    </>
  );
}

export default App;
