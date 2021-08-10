import './App.css';
import React, { useState } from "react";

import AboutPage from './pages/AboutPage';
import {
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
import PresentationsPage from './pages/PresentationsPage';
import PresentationEditPage from './pages/PresentationEditPage';
import PresentationViewPage from './pages/PresentationViewPage';
import StoragesPage from './pages/StoragesPage';
import StorageEditPage from './pages/StorageEditPage';
import StorageViewPage from './pages/StorageViewPage';
import UsersPage from './pages/UsersPage';
import UserService from './services/userService';
import { setAllUsers, setUserPagination } from './store/userSlice';
import UserEditPage from './pages/UserEditPage';


function App() {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [isLoad, setIsLoad] = useState(false)

  /* const [token, setToken] = useState(null)

  const formService = new FormService(); */

  const userService = new UserService();

  useEffect(() => {
    if (localStorage.getItem("jwt") !== null) {
      userService.getAllUsers().then(res => {
        dispatch(setAllUsers(res.users));
        dispatch(setUserPagination({
          page: res.page,
          total: res.total,
          limit: res.limit,
        }));
        dispatch(authLogin());
        setIsLoad(true);
      });
    } else {
      setIsLoad(true);
    }
  }, [auth]);

  return (
    <>
      {
        isLoad ?
          auth.isAuth ?
            isLoad ?
              <HashRouter>
                <Switch>
                  <Route path="/" component={Dashboard} exact={true} />
                  <Route path="/form/:formId" component={FormViewPage} />
                  <Route path="/storage/:storageId" component={StorageViewPage} />
                  <Route path="/presentation/:presentId" component={PresentationViewPage} />
                  <Route path="/dashboard" component={Dashboard} />
                  <Route path="/*" component={Dashboard} />
                </Switch>
              </HashRouter>
              :
              <LoadingStart />
            :
            <HashRouter>
              <Switch>
                <Route path="/" component={LoginPage} exact={true} />
                <Route path="/login" component={LoginPage} />
                <Route path="/signup" component={SignupPage} />
                <Route path="/*" component={LoginPage} />
              </Switch>
            </HashRouter>
          :
          <LoadingStart />
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
                <NavLink activeClassName="active" className="nav-link" to="/dashboard/storages"><i className="bi bi-terminal"></i>Storage Central</NavLink>
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
            <Route path={`${match.url}/storages`}>
              <StoragesPage />
            </Route>
            <Route path={`${match.url}/storage-add`}>
              <StorageEditPage />
            </Route>
            <Route path={`${match.url}/storage-edit/:storageId`}>
              <StorageEditPage />
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
            <Route path={`${match.url}/users`}>
              <UsersPage />
            </Route>
            <Route path={`${match.url}/user-edit/:userId`}>
              <UserEditPage />
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

function LoadingStart() {
  return <div style={{ position: "absolute", left: "50%", transform: "translate(-50%, -50%)", top: "50%" }}>
    Bekleyiniz...
  </div>
}


export default App;
