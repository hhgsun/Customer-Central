import React, { useState } from 'react'
import { NavLink, useHistory } from 'react-router-dom';
import AuthService from '../services/authService';
import LogoImg from "../images/logo.png";
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
        <img src={LogoImg} alt="Client Center" className="mb-5" height="48" />

        <div className="input-group mb-3">
          <span className="input-group-text bg-light border-0 ps-3 text-muted" id="basic-addon1"><i className="bi bi-envelope"></i></span>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control bg-light border-0 py-3 ps-1" placeholder="Email" aria-label="Email" aria-describedby="basic-addon1" required />
        </div>

        <div className="input-group mb-3">
          <span className="input-group-text bg-light border-0 ps-3 text-muted" id="basic-addon2"><i className="bi bi-key"></i></span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control bg-light border-0 py-3 ps-1" placeholder="Password" aria-label="Password" aria-describedby="basic-addon2" required minLength="4" />
        </div>

        <button className="w-100 btn btn-lg btn-primary mt-3" type="submit" disabled={disabledBtn} style={{backgroundColor: "var(--primary-bg)"}}>
          Sign in
        </button>

        <NavLink className="btn w-100 mt-5" to="/signup"><i className="bi bi-person-plus"></i> Create an account</NavLink>

      </form>
    </div>
  )
}
