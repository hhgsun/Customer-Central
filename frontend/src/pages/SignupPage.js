import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import AuthService from '../services/authService'

export default function SignupPage() {

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordRes, setPasswordRes] = useState("")

  const submitForm = (e) => {
    e.preventDefault();
    if( password !== passwordRes ) {
      alert("Şifre ve tekrarının aynı olduğuna emin olun.")
      return;
    }
    let authService = new AuthService();
    authService.register({
      "email": email,
      "password": password,
      "firstname": firstName,
      "lastname": lastName
    }).then(res => {
      if( res.message ) {
        alert(res.message);
      } else {
        console.log(res);
      }
    });
  }

  return (
    <div className="signup-page d-flex justify-content-center align-items-center bg-light">
      <form className="form-signin" onSubmit={(e) => submitForm(e)}>
        <img className="mb-4" src="http://thebluered.co.uk/wp-content/uploads/2021/05/cropped-logo-1-e1621355087557.png" alt="thebluered" />
        <h1 className="h3 mb-3 fw-normal mt-3">Please sign up</h1>

        <div className="form-floating mb-1">
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="form-control" placeholder="" required />
          <label>First Name</label>
        </div>
        <div className="form-floating mb-1">
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="form-control" placeholder="" required />
          <label>Last Name</label>
        </div>
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

        <button className="w-100 btn btn-lg btn-primary mt-3" type="submit">Sign up</button>

        <NavLink className="btn btn-light w-100 mt-3" to="/login"><i className="bi bi-box-arrow-in-left"></i> Login</NavLink>

      </form>
    </div>
  )
}
