import React, { useState } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import AuthService from '../services/authService'
import LogoTBR from "../images/logo-tbr.png";
import { toast } from 'react-toastify';

export default function SignupPage() {
  let history = useHistory();

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordRes, setPasswordRes] = useState("")

  const [disabledBtn, setDisabledBtn] = useState(false)

  const authService = new AuthService();

  const submitForm = (e) => {
    e.preventDefault();
    if (password !== passwordRes) {
      toast.warn("Şifre ve tekrarının aynı olduğuna emin olun.");
      return;
    }
    setDisabledBtn(true);
    authService.register({
      "email": email,
      "password": password,
      "firstname": firstName,
      "lastname": lastName
    }).then(res => {
      if (res.message) {
        toast.warn(res.message);
        setTimeout(() => {
          setDisabledBtn(false);
        }, 500);
      } else {
        toast.success("👌 Kayıt işlemi başarılı, giriş yapabilirsiniz.");
        setTimeout(() => {
          authService.login({
            "email": email,
            "password": password
          }).then(res => {
            if (res.success) {
              localStorage.setItem("jwt", res.jwt);
              history.push("/");
              window.location.reload();
            } else {
              history.push("/");
              toast.warn(res.message);
            }
          });
        }, 1000);
      }
    });
  }

  return (
    <div className="signup-page d-flex justify-content-center align-items-center bg-light">
      <form className="form-signin" onSubmit={(e) => submitForm(e)}>
        <img className="mb-5" src={LogoTBR} alt="thebluered" width="200" />
        {/* <h1 className="h3 mb-3 fw-normal mt-3">Please sign up</h1> */}

        <div className="form-floating mb-1">
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="form-control" placeholder="" required />
          <label>First Name</label>
        </div>
        <div className="form-floating mb-1">
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="form-control" placeholder="" required />
          <label>Last Name</label>
        </div>
        <hr className="my-3" />
        <div className="form-floating mb-1">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="" required />
          <label>Email address</label>
        </div>
        <div className="form-floating mb-1">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder="" required minLength="6" />
          <label>Password</label>
        </div>
        <div className="form-floating mb-1">
          <input type="password" value={passwordRes} onChange={(e) => setPasswordRes(e.target.value)} className="form-control" placeholder="" required />
          <label>Re - Password</label>
        </div>

        <button className="w-100 btn btn-lg btn-primary mt-3" type="submit" disabled={disabledBtn}>Sign up</button>

        <NavLink className="btn btn-light w-100 mt-3" to="/signin"><i className="bi bi-box-arrow-in-left"></i> Login</NavLink>

      </form>
    </div>
  )
}
