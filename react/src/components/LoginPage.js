/* Login Page */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies, withCookies } from 'react-cookie';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Card from 'react-bootstrap/Card';
import axios from 'axios';


function App(props) {
  const navigate = useNavigate();
  const [userNameValue, setUserNameValue] = useState({value: ""});
  const [passwordValue, setPasswordValue] = useState({value: ""});
  const [errorMessage, setErrorMessage] = useState({ value: undefined });
  const [errMsg, setErrMsg] = useState(null);
  const [cookies, setCookies] = useCookies(['sessionID', 'sessionIGN']);

  const onUserName = (e) => {
    setUserNameValue({ value: e.target.value });
  }
  const onPassword = (e) => {
    setPasswordValue({ value: e.target.value });
  }
  const onLogin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // API
    if (userNameValue.value.length === 0 ||
        passwordValue.value.length === 0) {
      setErrorMessage({value: 'Fill in username and password'});
    } else {
      let url = "";
      if (process.env.NODE_ENV === "development")
        url = `http://127.0.0.1:3001/api/users/login`;
      else
        url = "/api/users/login";
      axios.post(url, {
        username: userNameValue.value,
        pwd: passwordValue.value
      }).then(res => {
        if (res.data.success) {
          // Session cookies creation
          setCookies('sessionID', res.data.success.id, { expires: new Date((60000 * 60) + res.data.success.access_time) });
          setCookies('sessionIGN', res.data.success.ign, { expires: new Date((60000 * 60) + res.data.success.access_time) });
          window.location.href = "/";
        } else if (res.data.error) {
          if (res.data.error.message === "Invalid Password")
            setErrorMessage({value: 'Wrong Password'});
          else if (res.data.error.message === "No Record Found")
            setErrorMessage({value: 'User does not exist'});
        }
      }).catch((err) => {
        setErrorMessage({value: err.response.data.error});
      });
    }
  }

  useEffect(() => {
    if (errMsg && errorMessage.value) {
      if (!errMsg.classList.contains("show"))
        errMsg.classList.add("show");
    }
    if ((props.cookies.sessionID && props.cookies.sessionIGN) ||
        (cookies.sessionID && cookies.sessionIGN))
      navigate("/");
  }, [props, navigate, cookies, errMsg, errorMessage]);
  if ((props.cookies.sessionID && props.cookies.sessionIGN) ||
      (cookies.sessionID && cookies.sessionIGN))
    return (<div className="App-header"><Container><Spinner /></Container></div>);
  return (
  <div className="App-header">
    <Container>
      <div className="d-flex flex-column flex-justify-center ms-auto me-auto" style={{width: '20em'}}>
        <div className="mb-4 h1 fw-bold">
          Login
        </div>
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
        <hr />
        <a href="signup" className="m-3 btn btn-success">Sign Up Now!</a>
      </div>
    </Container>
  </div>
  );
}

export default withCookies(App);
