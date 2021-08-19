import './App.css';
import React, { useState } from "react";

import {
  Switch,
  Route,
  HashRouter
} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import SigninPage from './pages/SigninPage';
import SignupPage from './pages/SignupPage';
import { authLogin } from './store/authSlice';
import UserService from './services/userService';
import { setAllUsers, setUserPagination } from './store/userSlice';
import AuthService from './services/authService';
import LoadingSpinner from './components/LoadingSpinner';
import { ToastContainer } from 'react-toastify';
import { JWT_LOCALSTORAGE_NAME } from './config';
import AdminDashboard from './components/dashboard/AdminDash';
import UserDashboard from './components/dashboard/UserDash';

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
    if (localStorage.getItem(JWT_LOCALSTORAGE_NAME) !== null && authData === null) {
      authService.authCheck({ token: localStorage.getItem(JWT_LOCALSTORAGE_NAME) }).then(res => {
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


export default App;
