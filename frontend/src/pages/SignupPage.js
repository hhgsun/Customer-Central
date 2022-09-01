import React, { useState } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import AuthService from '../services/authService'
import LogoImg from "../images/logo.png";
import { toast } from 'react-toastify';
import { JWT_LOCALSTORAGE_NAME } from '../config';

export default function SignupPage() {
  let history = useHistory();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordRes, setPasswordRes] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

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
              localStorage.setItem(JWT_LOCALSTORAGE_NAME, res.jwt);
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
        <img src={LogoImg} alt="thebluered" className="mb-5" height="48" />
        <div className="form-floating mb-1">
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="" required />
          <label>Email address or Username</label>
        </div>
        <div className="form-floating mb-1">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder="" required minLength="6" />
          <label>Password</label>
        </div>
        <div className="form-floating mb-1">
          <input type="password" value={passwordRes} onChange={(e) => setPasswordRes(e.target.value)} className="form-control" placeholder="" required />
          <label>Re - Password</label>
        </div>
        <div className="py-2"></div>
        <div className="form-floating mb-1">
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="form-control" placeholder="" required />
          <label>First Name</label>
        </div>
        <div className="form-floating mb-1">
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="form-control" placeholder="" required />
          <label>Last Name</label>
        </div>

        <button className="w-100 btn btn-lg btn-primary mt-3" type="submit" disabled={disabledBtn}>Sign up</button>

        <NavLink className="btn w-100 mt-5" to="/signin"><i className="bi bi-box-arrow-in-left"></i> Login</NavLink>

      </form>
    </div>
  )
}
