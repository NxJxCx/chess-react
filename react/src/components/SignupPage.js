/* Signup Page */
import React, { useState } from 'react';
//import Session from 'react-session-api';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

const invalids = {
  empty: "Fill in missing field",
  ignLength: "IGN Name must contain 4-15 characters only",
  userLength: "Username must contain 4-15 characters only",
  usernameExists: "Username already exists",
  pwdInvalid: "Your password @must contain #.",
  pwdNotMatch: "Passwords does not match",
  pwdLength: "Password must contain at least 6 characters",
  ignInvalid: "Only letters (a-zA-Z), numbers (0-9), underscore (_), dot (.), and asterisk (*) are allowed. Special characters such as $#@?! are not allowed",
  userInvalid:"Only letters (a-zA-Z), numbers (0-9), underscore (_), and dot (.) are allowed. Special characters such as $#@?! are not allowed", 
}

/*
  const TestDOM = function(props) {
    return (
      <>
        <div>
          {props.data}
        </div>
        <br />
      </>
    );
  }
*/

// const specialchars = /^[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~\d]*$/;
const pattern_an = /^[A-Za-z][A-Za-z0-9_.]{3,14}$/;
const pattern_an2 = /^[A-Za-z][A-Za-z0-9_.*]{3,14}$/;
const strong_pass = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;

function App() {
  const [formValue, setFormValue] = useState({ ignname: "", username: "", password: "", rpassword: "", accept: false });
  const [validated, setValidated] = useState(false);
  const [ignRef, setIgnRef] = useState(null);
  const [userRef, setUserRef] = useState(null);
  const [passRef, setPassRef] = useState(null);
  const [rPassRef, setRPassRef] = useState(null);
  const [acceptRef, setAcceptRef] = useState(null);
  const [ignError, setIgnError] = useState("");
  const [userError, setUserError] = useState("");
  const [passError, setPassError] = useState("");
  const [rPassError, setRPassError] = useState("");
  // const [testDiv, setTestDiv] = useState("");

  const onIGN = (e) => {
    setFormValue({...formValue, [e.target.name] : e.target.value });
  }
  const isIGNValid = () => {
    if (formValue.ignname.length > 3 &&
        pattern_an2.test(formValue.ignname))
      return true;
  }
  const isIGNInvalid = () => {
    if (validated && formValue.ignname.length === 0) {
      if (ignError !== invalids.empty)
        setIgnError(invalids.empty);
      return true;
    }
    if (formValue.ignname.length > 0) {
      if (formValue.ignname.length < 4) {
        if (ignError !== invalids.ignLength)
          setIgnError(invalids.ignLength);
        return true;
      }
      if (!pattern_an2.test(formValue.ignname)) {
        if (ignError !== invalids.ignInvalid)
          setIgnError(invalids.ignInvalid);
        return true;
      }
    }
  }

  const onUserName = (e) => {
    setFormValue({...formValue, [e.target.name] : e.target.value });
  }
  const isUserValid = () => {
    if (formValue.username.length > 3 &&
        pattern_an.test(formValue.username))
      return true;
  }
  const isUserInvalid = () => {
    if (validated && formValue.username.length === 0) {
      if (userError !== invalids.empty)
        setUserError(invalids.empty);
      return true;
    }
    if (formValue.username.length > 0) {
      if (formValue.username.length < 4) {
        if (userError !== invalids.userLength)
          setUserError(invalids.userLength);
        return true;
      }
      if (!pattern_an.test(formValue.username)) {
        if (userError !== invalids.userInvalid)
          setUserError(invalids.userInvalid);
        return true;
      }
    }
  }

  const onPassword = (e) => {
    setFormValue({...formValue, [e.target.name] : e.target.value });
  }
  const passValid = () => {
    if (formValue.password.length > 0 &&
        strong_pass.test(formValue.password)) {
      return true;
    }
  }
  const passInvalid = () => {
    if (validated && formValue.password.length === 0) {
      if (passError !== invalids.empty)
        setPassError(invalids.empty);
      return true;
    }
    if (formValue.password.length > 0) {
      if (!strong_pass.test(formValue.password)) {
        const tmpA = [
         /(?=.*[a-z])(?=.*)/,
         /(?=.*[A-Z])(?=.*)/,
         /(?=.*[0-9])(?=.*)/,
         /(?=.*[^A-Za-z0-9])(?=.*)/,
         /^[A-Za-z0-9^A-Za-z0-9]{8,}$/g];
        const tmpB = ["lower letters, ", "UPPER letters, ", "numbers, ", "special characters, ", "must be at least 8 characters long, "];
        let tmpC = [];
        for (let i = 0; i < tmpA.length; i++) {
          if (!tmpA[i].test(formValue.password)) {
            tmpC.push(i);
          }
        }
        const noLenErr = tmpC.indexOf(4) > -1;
        const len = tmpC.length;
        let pwdIStr = "";
        tmpC.forEach((it, i) => {
          if (it !== 4) {
            if ((noLenErr && i+1 === len-1) ||
                (!noLenErr && i+1 === len)) {
              pwdIStr += tmpB[it].substring(0, tmpB[it].length-2);
            } else {
              pwdIStr += tmpB[it].toString();
            }
          }
        });
        let pwdInvalid = pwdIStr === "" ? (
            invalids.pwdInvalid.replace("@", (
              tmpC.indexOf(4) === -1 ? "" : tmpB[4].substring(0, tmpB[4].length-2)
            ))
          ) : (
            invalids.pwdInvalid.replace("@", (
              tmpC.indexOf(4) === -1 ? "" : tmpB[4]
            ))
        );
        pwdInvalid = pwdIStr === "" ? pwdInvalid.replace("must contain #", "") : pwdInvalid.replace("#", pwdIStr);
        if (passError !== pwdInvalid)
          setPassError(pwdInvalid);
        return true;
      }
    }
  }

  const onRPassword = (e) => {
    setFormValue({...formValue, [e.target.name] : e.target.value });
  }
  const rpassValid = () => {
    if (formValue.rpassword.length > 0 &&
        strong_pass.test(formValue.rpassword)) {
      return true;
    }
  }
  const rpassInvalid = () => {
    if (validated && formValue.rpassword.length === 0) {
      if (rPassError !== invalids.empty)
        setRPassError(invalids.empty)
      return true;
    }
    if (formValue.rpassword.length > 0) {
      if (formValue.rpassword !== formValue.password) {
        if (rPassError !== invalids.pwdNotMatch)
          setRPassError(invalids.pwdNotMatch);
        return true;
      }
    }
  }

  const onAcceptTerms = (e) => {
    setFormValue({...formValue, [e.target.name] : e.target.checked });
  }

  const onRegister = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (ignRef.checkValidity() &&
        userRef.checkValidity() &&
        passRef.checkValidity() &&
        rPassRef.checkValidity() &&
        acceptRef.checkValidity()) {
      // TODO: post api

    }
    setValidated(true);
  }

  return (
    <>
      <div className="App-header">
        <Container>
          <div className="d-flex flex-column flex-justify-center ms-auto me-auto" style={{width: '20em'}}>
            <div className="mt-4 mb-4 h1 fw-bold">
              Sign Up
            </div>
            <Form noValidate validated={validated} onSubmit={onRegister} autoComplete="off">
              <Form.Group as={FloatingLabel} className="ms-3 me-3 mb-3 pt-2 text-dark fs-4" controlId="ignFloat" label="IGN Name">
                <Form.Control type="text" autoComplete="off" name="ignname" placeholder="IGN Name" value={formValue.ignname} onChange={onIGN} ref={setIgnRef} required isValid={isIGNValid()} isInvalid={isIGNInvalid()} pattern={pattern_an2.toString().substring(2, pattern_an2.toString().length-2)} />
                <Form.Control.Feedback type="invalid">
                  {ignError}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={FloatingLabel} className="ms-3 me-3 mb-3 pt-2 text-dark fs-4" controlId="userFloat" label="Username">
                <Form.Control type="text" autoComplete="off" name="username" placeholder="Username" value={formValue.username} onChange={onUserName} isValid={isUserValid()} isInvalid={isUserInvalid()} ref={setUserRef} required pattern={pattern_an.toString().substring(2, pattern_an.toString().length-2)} />
                <Form.Control.Feedback type="invalid">
                  {userError}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={FloatingLabel} className="ms-3 me-3 mb-3 pt-2 text-dark fs-4" controlId="passFloat" label="New Password">
                <Form.Control type="password" name="password" placeholder="New Password" value={formValue.password} onChange={onPassword} ref={setPassRef} isValid={passValid()} isInvalid={passInvalid()} required />
                <Form.Control.Feedback type="invalid">
                  {passError}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={FloatingLabel} className="ms-3 me-3 mb-3 pt-2 text-dark fs-4" controlId="rpassFloat" label="Repeat Password">
                <Form.Control type="password" name="rpassword" placeholder="Repeat Password" value={formValue.rpassword} onChange={onRPassword} isValid={rpassValid()} isInvalid={rpassInvalid()} ref={setRPassRef} required />
                <Form.Control.Feedback type="invalid">
                  {rPassError}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3 ms-auto me-auto d-flex" controlId="acceptForm">
                <Form.Check name="accept" className="ms-3 ms-auto me-auto flex-column align-items-center" label="Agree to terms and conditions" feedback="You must agree to the terms and conditions." feedbackType="invalid" onChange={onAcceptTerms} ref={setAcceptRef} required />{' '}
              </Form.Group>
              <Form.Group className="mb-3 ms-3 me-3">
                <Button type="submit" variant="primary" className="mb-3 ps-4 pe-4" >Register</Button>
              </Form.Group>
            </Form>
            {/* <div>{testDiv}</div> */}
            <hr />
            <a href="signup" className="m-3 btn btn-success">Already have an account? Login Here!</a>
          </div>
        </Container>
      </div>
    </>
  );
}

export default App;
