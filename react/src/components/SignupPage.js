/* Signup Page */
import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import axios from 'axios';

const invalids = {
  empty: "Fill in missing field",
  ignExists: "IGN Name already exists",
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
  const [passRef, setPassRef] = useState(null);
  const [rPassRef, setRPassRef] = useState(null);
  const [acceptRef, setAcceptRef] = useState(null);
  const [ignError, setIgnError] = useState("");
  const [userError, setUserError] = useState("");
  const [passError, setPassError] = useState("");
  const [rPassError, setRPassError] = useState("");
  const [isValidIGN, setIsValidIGN] = useState(false);
  const [isValidUser, setIsValidUser] = useState(false);
  const [isValidPass, setIsValidPass] = useState(false);
  const [isValidRPass, setIsValidRPass] = useState(false);
  const [cookies] = useCookies(['sessionID', 'sessionIGN']);

  const onIGN = async (e) => {
    setFormValue({...formValue, [e.target.name] : e.target.value });
    let isValid = true;
    const ign = e.target.value;
    if (ign.length === 0) {
      if (ignError !== invalids.empty)
        setIgnError(invalids.empty);
      isValid = false;
    } else {
      if (ign.length > 0) {
        if (ign.length < 4) {
          if (ignError !== invalids.ignLength)
            setIgnError(invalids.ignLength);
          isValid = false;
        } else {
          if (!pattern_an2.test(ign)) {
            if (ignError !== invalids.ignInvalid)
              setIgnError(invalids.ignInvalid);
            isValid = false;
          }
        }
      }
    }
    if (!isValid) {
      if (ign.length > 3 &&
        pattern_an2.test(ign))
        isValid = true;
    }
    if (isValid) {
      let url = "";
      if (process.env.NODE_ENV !== 'production')
        url = `http://127.0.0.1:3001/api/users/check/exists/ign`;
      else
        url = "/api/users/check/exists/ign";
      try {
        const isExist = await axios.get(url, {
          params: {
            v: `${ign}`
          }
        });
        if (isExist.data.success) {
          isValid = false;
          setIgnError(invalids.ignExists);
        }
      } catch (err) {
        console.log(err);
        isValid = false;
      }
    }
    if (isValidIGN !== isValid)
      setIsValidIGN(isValid);
  }

  const onUserName = async (e) => {
    setFormValue({...formValue, [e.target.name] : e.target.value });
    let isValid = true;
    const uname = e.target.value;
    if (uname.length === 0) {
      if (userError !== invalids.empty)
        setUserError(invalids.empty);
      isValid = false;
    } else {
      if (uname.length > 0) {
        if (uname.length < 4) {
          if (userError !== invalids.userLength)
            setUserError(invalids.userLength);
          isValid = false;
        } else {
          if (!pattern_an2.test(uname)) {
            if (userError !== invalids.userInvalid)
              setUserError(invalids.userInvalid);
            isValid = false;
          }
        }
      }
    }
    if (!isValid) {
      if (uname.length > 3 &&
        pattern_an2.test(uname))
        isValid = true;
    }
    if (isValid) {
      let url = "";
      if (process.env.NODE_ENV !== 'production')
        url = `http://127.0.0.1:3001/api/users/check/exists/username`;
      else
        url = "/api/users/check/exists/username";
      try {
        const isExist = await axios.get(url, {
          params: {
            v: `${uname}`
          }
        });
        if (isExist.data.success) {
          isValid = false;
          setUserError(invalids.usernameExists);
        }
      } catch (err) {
        console.log(err);
        isValid = false;
      }
    }
    if (isValidUser !== isValid)
      setIsValidUser(isValid);
  }

  const onPassword = (e) => {
    setFormValue({...formValue, [e.target.name] : e.target.value });
    let isValid = true;
    const pass = e.target.value;
    if (pass.length === 0) {
      if (passError !== invalids.empty)
        setPassError(invalids.empty);
      isValid = false;
    } else {
      if (pass.length > 0) {
        if (!strong_pass.test(pass)) {
          const tmpA = [
          /(?=.*[a-z])(?=.*)/,
          /(?=.*[A-Z])(?=.*)/,
          /(?=.*[0-9])(?=.*)/,
          /(?=.*[^A-Za-z0-9])(?=.*)/,
          /^[A-Za-z0-9^A-Za-z0-9]{8,}$/g];
          const tmpB = ["lower letters, ", "UPPER letters, ", "numbers, ", "special characters, ", "must be at least 8 characters long, "];
          let tmpC = [];
          for (let i = 0; i < tmpA.length; i++) {
            if (!tmpA[i].test(pass)) {
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
          isValid = false;
        }
      }
    }
    if (!isValid) {
      if (pass.length > 0 &&
        strong_pass.test(pass))
        isValid = true;
    }
    if (isValidPass !== isValid)
      setIsValidPass(isValid);
  }

  const onRPassword = (e) => {
    setFormValue({...formValue, [e.target.name] : e.target.value });
    let isValid = true;
    const rpass = e.target.value;
    if (rpass.length === 0) {
      if (rPassError !== invalids.empty)
        setRPassError(invalids.empty)
      isValid = false;
    }
    if (rpass.length > 0) {
      if (rpass !== formValue.password) {
        if (rPassError !== invalids.pwdNotMatch)
          setRPassError(invalids.pwdNotMatch);
        isValid = false;
      }
    }
    if (!isValid) {
      if (rpass.length > 0 &&
        strong_pass.test(rpass))
        isValid = true;
    }
    if (isValidRPass !== isValid)
      setIsValidRPass(isValid);
  }

  const onAcceptTerms = (e) => {
    setFormValue({...formValue, [e.target.name] : e.target.checked });
  }

  const onRegister = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isValidIGN &&
        isValidUser &&
        passRef.checkValidity() &&
        rPassRef.checkValidity() &&
        acceptRef.checkValidity()) {
      let url = "";
      if (process.env.NODE_ENV !== 'production')
        url = `http://127.0.0.1:3001/api/users`;
      else
        url = "/api/users";
      axios.post(url, {
        ign: formValue.ignname,
        username: formValue.username,
        password_encrypted: formValue.password
      }).then(res => {
        console.log("DONE!");
        if (res.data.success)
          console.log(res.data.success);
        else if (res.data.error)
          console.log(res.data.error);
        window.location.href = '/login';
      }).catch(err => {
        console.log(err);
      });
    }
  }

  useEffect(() => {
    if (cookies.sessionID && cookies.sessionIGN) {
      return () => { window.location.href = '/' };
    }
  }, [cookies.sessionID, cookies.sessionIGN])
  return (
    <>
      <div className="App-header">
        <Container>
          <div className="d-flex flex-column flex-justify-center ms-auto me-auto" style={{width: '20em'}}>
            <div className="mt-4 mb-4 h1 fw-bold">
              Sign Up
            </div>
            <Form noValidate onSubmit={onRegister} autoComplete="off">
              <Form.Group as={FloatingLabel} className="ms-3 me-3 mb-3 pt-2 text-dark fs-4" controlId="ignFloat" label="IGN Name">
                <Form.Control type="text" autoComplete="off" name="ignname" placeholder="IGN Name" value={formValue.ignname} onChange={onIGN} required pattern={pattern_an2.toString().substring(2, pattern_an2.toString().length-2)} isValid={isValidIGN} isInvalid={formValue.ignname.length === 0 ? undefined : !isValidIGN} />
                <Form.Control.Feedback type="invalid">
                  {ignError}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={FloatingLabel} className="ms-3 me-3 mb-3 pt-2 text-dark fs-4" controlId="userFloat" label="Username">
                <Form.Control type="text" autoComplete="off" name="username" placeholder="Username" value={formValue.username} onChange={onUserName} required pattern={pattern_an.toString().substring(2, pattern_an.toString().length-2)} isValid={isValidUser} isInvalid={formValue.username.length === 0 ? undefined : !isValidUser} />
                <Form.Control.Feedback type="invalid">
                  {userError}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={FloatingLabel} className="ms-3 me-3 mb-3 pt-2 text-dark fs-4" controlId="passFloat" label="New Password">
                <Form.Control type="password" name="password" placeholder="New Password" value={formValue.password} onChange={onPassword} ref={setPassRef} required isValid={isValidPass} isInvalid={formValue.password.length === 0 ? undefined : !isValidPass} />
                <Form.Control.Feedback type="invalid">
                  {passError}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={FloatingLabel} className="ms-3 me-3 mb-3 pt-2 text-dark fs-4" controlId="rpassFloat" label="Repeat Password">
                <Form.Control type="password" name="rpassword" placeholder="Repeat Password" value={formValue.rpassword} onChange={onRPassword} ref={setRPassRef} required isValid={isValidRPass} isInvalid={formValue.rpassword.length === 0 ? undefined : !isValidRPass} />
                <Form.Control.Feedback type="invalid">
                  {rPassError}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3 ms-auto me-auto d-flex" controlId="acceptForm">
                <Form.Check name="accept" className="ms-3 ms-auto me-auto flex-column align-items-center" label="Agree to terms and conditions" feedback="You must agree to the terms and conditions." feedbackType="invalid" onChange={onAcceptTerms} ref={setAcceptRef} required />{' '}
              </Form.Group>
              <Form.Group className="mb-3 ms-3 me-3">
                <Button type="submit" variant="primary" className="mb-3 ps-4 pe-4" disabled={formValue.ignname.length < 4 || formValue.username.length < 4 || formValue.password.length < 8 || formValue.rpassword.length < 8 || !formValue.accept || !isValidIGN || !isValidUser ? true : false}>Register</Button>
              </Form.Group>
            </Form>
            <hr />
            <a href="login" className="m-3 btn btn-success">Already have an account? Login Here!</a>
          </div>
        </Container>
      </div>
    </>
  );
}

export default App;
