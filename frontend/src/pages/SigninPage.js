import React, { useState } from 'react'
import { NavLink, useHistory } from 'react-router-dom';
import AuthService from '../services/authService';
import LogoTBR from "../images/logo-tbr.png";
import { toast } from 'react-toastify';
import { JWT_LOCALSTORAGE_NAME } from '../config';

export default function SigninPage() {
  let history = useHistory();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [disabledBtn, setDisabledBtn] = useState(false)

  const authService = new AuthService();

  const submitForm = (e) => {
    e.preventDefault();
    setDisabledBtn(true);
    authService.login({
      "email": email,
      "password": password
    }).then(res => {
      if (res.success) {
        localStorage.setItem(JWT_LOCALSTORAGE_NAME, res.jwt);
        history.push("/");
        window.location.reload();
        //setDisabledBtn(false);
      } else {
        toast.warn(res.message);
        setTimeout(() => {
          setDisabledBtn(false);
        }, 500);
      }
    })
  }

  return (
    <div className="signin-page d-flex justify-content-center align-items-center bg-light">
      <form className="form-signin" onSubmit={(e) => submitForm(e)}>
        <img className="mb-5" src={LogoTBR} alt="thebluered" width="200" />
        {/* <h1 className="h3 mb-3 fw-normal mt-3">Please sign in</h1> */}

        <div className="form-floating">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="name@example.com" required />
          <label>Email address</label>
        </div>
        <div className="form-floating">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder="Password" required minLength="6" />
          <label>Password</label>
        </div>
        <button className="w-100 btn btn-lg btn-primary mt-3" type="submit" disabled={disabledBtn}>Sign in</button>

        <NavLink className="btn btn-light w-100 mt-3" to="/signup"><i className="bi bi-person-plus"></i> Sign Up</NavLink>

      </form>
    </div>
  )
}
