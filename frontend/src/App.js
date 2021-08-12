import './App.css';
import React, { useState } from "react";

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
import SigninPage from './pages/SigninPage';
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
import { setAllUsers, setCurrentUserData, setUserPagination } from './store/userSlice';
import UserEditPage from './pages/UserEditPage';
import AuthService from './services/authService';
import LoadingSpinner from './components/LoadingSpinner';
import UserHomePage from './pages/UserHomePage';
import UserSettingsPage from './pages/UserSettingsPage';
import { setCurrentPageTitle } from './store/utilsSlice';
import { ToastContainer } from 'react-toastify';

// import 'react-toastify/dist/ReactToastify.css';
// minified version is also included
import 'react-toastify/dist/ReactToastify.min.css';

function App() {
  const currentPageTitle = useSelector(state => state.utils.currentPageTitle);

  const authData = useSelector(state => state.auth.authData);
  const dispatch = useDispatch();

  const [isLoad, setIsLoad] = useState(false)

  const userService = new UserService();
  const authService = new AuthService();

  useEffect(() => {
    if (localStorage.getItem("jwt") !== null && authData === null) {
      authService.authCheck({ token: localStorage.getItem("jwt") }).then(res => {
        if (res.success) {
          const { jwt } = res;
          const { data } = jwt;
          if (data && data.email) {
            dispatch(authLogin(data));
            userService.getAllUsers().then(res => {
              dispatch(setAllUsers(res.users));
              dispatch(setUserPagination({
                page: res.page,
                total: res.total,
                limit: res.limit,
              }));
              setIsLoad(true);
            }).catch(e => {
              setIsLoad(true)
            });
          } else {
            setIsLoad(true);
          }
        } else {
          setIsLoad(true);
        }
      });
    } else {
      setIsLoad(true);
    }
  }, [authData]);

  useEffect(() => {
    if (currentPageTitle) {
      document.title = currentPageTitle;
    } else {
      document.title = "Client Central";
    }
  }, [currentPageTitle]);


  return (
    <>
      {
        isLoad ?
          authData != null ?
            <HashRouter>
              <Switch>
                <Route path="/" component={authData.isAdmin === "1" ? AdminDashboard : UserDashboard} exact={true} />
                <Route path="/admin" component={authData.isAdmin === "1" ? AdminDashboard : UserDashboard} />
                <Route path="/client" component={UserDashboard} />
                <Route path="/*" component={authData.isAdmin === "1" ? AdminDashboard : UserDashboard} />
              </Switch>
            </HashRouter>
            :
            <HashRouter>
              <Switch>
                <Route path="/" component={SigninPage} exact={true} />
                <Route path="/signin" component={SigninPage} />
                <Route path="/signup" component={SignupPage} />
                <Route path="/*" component={SigninPage} />
              </Switch>
            </HashRouter>
          :
          <LoadingSpinner />
      }
      <ToastContainer
        position="bottom-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
      />
    </>
  );
}


function AdminDashboard({ match }) {
  let history = useHistory();

  const logout = (e) => {
    localStorage.removeItem("jwt");
    history.push('/');
    window.location.reload();
  }
  return <div className="admin-dashboard">
    <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap px-3 shadow">
      <NavLink className="navbar-brand col-md-3 col-lg-2 me-0" to="/">Client Central</NavLink>
      <button className="navbar-toggler d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
    </header>
    <div className="container-fluid">
      <div className="row">
        <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
          <div className="position-sticky pt-3 h-100">
            <ul className="nav flex-column h-100">
              <li className="nav-item">
                <NavLink exact activeClassName="active" className="nav-link" to="/admin"><i className="bi bi-terminal"></i>Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink activeClassName="active" className="nav-link" to="/admin/forms"><i className="bi bi-terminal"></i>Brief Central</NavLink>
              </li>
              <li className="nav-item">
                <NavLink activeClassName="active" className="nav-link" to="/admin/presentations"><i className="bi bi-terminal"></i>Presentation Central</NavLink>
              </li>
              <li className="nav-item">
                <NavLink activeClassName="active" className="nav-link" to="/admin/storages"><i className="bi bi-terminal"></i>Storage Central</NavLink>
              </li>
              <li className="nav-item">
                <NavLink activeClassName="active" className="nav-link" to="/admin/users"><i className="bi bi-terminal"></i>Users</NavLink>
              </li>
              <li className="mt-auto">
                <a href="#" className="nav-link" onClick={(e) => logout(e)}><i className="bi bi-box-arrow-left"></i>Çıkış Yap</a>
              </li>
            </ul>
          </div>
        </nav>
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 pt-3">
          <Switch>
            <Route path={`${match.url}/`} exact={true}>
              <HomeAdmin />
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
  </div>;
}

function UserDashboard({ match }) {
  const currentPageTitle = useSelector(state => state.utils.currentPageTitle);
  const authData = useSelector(state => state.auth.authData);

  let history = useHistory();

  const dispatch = useDispatch();

  const currentUserData = useSelector(state => state.users.currentUserData);

  const [isLoad, setIsLoad] = useState(false);

  const userService = new UserService();

  useEffect(() => {
    if (authData.id) {
      if (currentUserData !== null) {
        setIsLoad(true);
      } else {
        userService.getUserDetail(authData.id).then(res => {
          dispatch(setCurrentUserData(res))
          setIsLoad(true);
        })
      }
    } else {
      setIsLoad(true);
    }
  }, [])

  const logout = (e) => {
    localStorage.removeItem("jwt");
    history.push('/');
    window.location.reload();
  }
  return (
    isLoad && currentUserData
      ?
      <div className="user-dashboard">
        <header className="p-3 border-bottom">
          <div className="container">
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
              <NavLink className="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none" to="/">
                {
                  currentPageTitle
                    ? <i className="bi bi-arrow-left-square me-2 text-secondary"></i>
                    : <i className="bi bi-house-door me-2 text-secondary"></i>
                }
                Client Central {authData.isAdmin === "1" ? "- ADMIN" : ""}
              </NavLink>
              <span className="badge bg-secondary ms-2">{currentPageTitle}</span>

              {
                authData.isAdmin === "1"
                  ? <></>
                  :
                  <div className="dropdown text-end ms-auto">
                    <a href="#" className="d-block link-dark text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                      {authData.email}
                    </a>
                    <ul className="dropdown-menu text-small" aria-labelledby="dropdownUser1">
                      <li><NavLink className="dropdown-item" to="/client/settings">Settings</NavLink></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><a className="dropdown-item" href="#" onClick={(e) => logout(e)}>Sign out</a></li>
                    </ul>
                  </div>
              }

            </div>
          </div>
        </header>

        <main style={{ minHeight: "75vh" }}>
          <Switch>
            <Route path={`${match.url}/`} exact={true}>
              <UserHomePage />
            </Route>
            <Route path={`${match.url}/settings`}>
              <UserSettingsPage />
            </Route>
            <Route path={`${match.url}/form/:formId`} component={FormViewPage} />
            <Route path={`${match.url}/storage/:storageId`} component={StorageViewPage} />
            <Route path={`${match.url}/presentation/:presentId`} component={PresentationViewPage} />
          </Switch>
        </main>

        <UserDashFooter />
      </div>
      : <LoadingSpinner />
  )
}

function HomeAdmin() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCurrentPageTitle("Client Central Admin"));
  }, [])
  return (<h2>Home</h2>);
}

function UserDashFooter() {
  return (
    <div className="brief-footer no-print">
      <div className="container-brief">
        <div className="site-info text-center py-4">
          <a href="http://thebluered.co.uk/" title="TheBlueRed" target="_blank" rel="noreferrer" className="text-decoration-none small">
            Proudly powered by theBlueRed
          </a>
          <span style={{ display: "none" }}>
            dev by
            <a href="https://hhgsun.wordpress.com" target="_blank" rel="noreferrer">HHGsun</a>.
          </span>
        </div>
      </div>
    </div>
  )
}


export default App;
