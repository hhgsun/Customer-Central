import './App.css';
import React, { useState } from "react";

import AboutPage from './pages/AboutPage';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  useHistory,
  HashRouter
} from "react-router-dom";
import FormsPage from './pages/FormsPage';
import FormEditPage from './pages/FormEditPage';
import { useDispatch, useSelector } from 'react-redux';
import FormViewPage from './pages/FormViewPage';
import { useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { authLogin } from './store/authSlice';
import ClientsPage from './pages/ClientsPage';
import ClientEditPage from './pages/ClientEditPage';
import ClientViewPage from './pages/ClientViewPage';
import PresentationsPage from './pages/PresentationsPage';
import PresentationEditPage from './pages/PresentationEditPage';
import PresentationViewPage from './pages/PresentationViewPage';


function App() {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [isLoad, setIsLoad] = useState(false)

  /* const [token, setToken] = useState(null)

  const formService = new FormService(); */

  useEffect(() => {
    if (localStorage.getItem("jwt") !== null) {
      dispatch(authLogin());
    }
    setIsLoad(true);
  }, [auth]);

  return (
    <>
      {
        auth.isAuth ?
          isLoad ?
            <HashRouter>
              <Switch>
                <Route path="/" component={Dashboard} exact={true} />
                <Route path="/form/:formId" component={FormViewPage} />
                <Route path="/client/:clientId" component={ClientViewPage} />
                <Route path="/presentation/:presentId" component={PresentationViewPage} />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/*" component={Dashboard} />
              </Switch>
            </HashRouter>
            :
            <div>Bekleyiniz...</div>
          :
          <HashRouter>
            <Switch>
              <Route path="/" component={LoginPage} exact={true} />
              <Route path="/login" component={LoginPage} />
              <Route path="/signup" component={SignupPage} />
              <Route path="/*" component={LoginPage} />
            </Switch>
          </HashRouter>

      }
    </>
  );
}


function Dashboard({ match }) {
  let history = useHistory();

  const logout = (e) => {
    localStorage.removeItem("jwt");
    history.push('/');
    window.location.reload();
  }
  return <>
    <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap px-3 shadow">
      <NavLink className="navbar-brand col-md-3 col-lg-2 me-0" to="/">Client Central</NavLink>
      <button className="navbar-toggler d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
    </header>
    <div className="container-fluid">
      <div className="row">
        <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
          <div className="position-sticky pt-3">
            <ul className="nav flex-column">
              <li className="nav-item">
                <NavLink exact activeClassName="active" className="nav-link" to="/dashboard"><i className="bi bi-terminal"></i>Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink activeClassName="active" className="nav-link" to="/dashboard/forms"><i className="bi bi-terminal"></i>Brief Central</NavLink>
              </li>
              <li className="nav-item">
                <NavLink activeClassName="active" className="nav-link" to="/dashboard/presentations"><i className="bi bi-terminal"></i>Presentation Central</NavLink>
              </li>
              <li className="nav-item">
                <NavLink activeClassName="active" className="nav-link" to="/dashboard/clients"><i className="bi bi-terminal"></i>Storage Central</NavLink>
              </li>
              {/* <li className="nav-item">
                <NavLink activeClassName="active" className="nav-link" to="/dashboard/about"><i className="bi bi-terminal"></i>About</NavLink>
              </li> */}
              <li className="nav-item">
                <NavLink activeClassName="active" className="nav-link" to="/dashboard/users"><i className="bi bi-terminal"></i>Users</NavLink>
              </li>
              <li>
                <a href="#" className="nav-link" onClick={(e) => logout(e)}><i className="bi bi-box-arrow-left"></i>Çıkış Yap</a>
              </li>
            </ul>
          </div>
        </nav>
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 pt-3">
          <Switch>
            <Route path={`${match.url}/`} exact={true}>
              <Home />
            </Route>
            <Route path={`${match.url}/about`}>
              <AboutPage />
            </Route>
            <Route path={`${match.url}/forms`}>
              <FormsPage />
            </Route>
            <Route path={`${match.url}/form-add`}>
              <FormEditPage />
            </Route>
            <Route path={`${match.url}/form-edit/:formId`}>
              <FormEditPage />
            </Route>
            <Route path={`${match.url}/users`}>
              <Users />
            </Route>
            <Route path={`${match.url}/clients`}>
              <ClientsPage />
            </Route>
            <Route path={`${match.url}/client-add`}>
              <ClientEditPage />
            </Route>
            <Route path={`${match.url}/client-edit/:clientId`}>
              <ClientEditPage />
            </Route>
            <Route path={`${match.url}/presentations`}>
              <PresentationsPage />
            </Route>
            <Route path={`${match.url}/presentation-add`}>
              <PresentationEditPage />
            </Route>
            <Route path={`${match.url}/presentation-edit/:presentId`}>
              <PresentationEditPage />
            </Route>
          </Switch>
        </main>
      </div>
    </div>
  </>;
}

function Intro() {
  return <NavLink exact activeClassName="active" className="nav-link" to="/dashboard"><i className="bi bi-terminal"></i>ADMIN</NavLink>;
}

function Home() {
  return <h2>Home</h2>;
}

function Users() {
  return <h2>Users</h2>;
}


export default App;
