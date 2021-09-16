import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Route, Switch, useHistory } from "react-router-dom";
import { JWT_LOCALSTORAGE_NAME } from "../../config";
import FormViewPage from "../../pages/FormViewPage";
import PresentationViewPage from "../../pages/PresentationViewPage";
import StorageViewPage from "../../pages/StorageViewPage";
import UserSettingsPage from "../../pages/UserSettingsPage";
import UserHomePage from "../../pages/UserHomePage";
import UserService from "../../services/userService";
import { setCurrentUserData } from "../../store/userSlice";
import LoadingSpinner from "../LoadingSpinner";
import LogoTBRCC from "../../images/logo-tbr-clientcentral.png";
import UserAvatar from "../UserAvatar";
import ImageModal from "../ImageModal";

function UserDashboard({ match }) {
  const currentPageTitle = useSelector(state => state.utils.currentPageTitle);
  const imageModalSrc = useSelector(state => state.utils.imageModalSrc);
  const authData = useSelector(state => state.auth.authData);

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

  return (
    isLoad && currentUserData
      ?
      <div className="user-dashboard">
        <header className="navbar navbar-expand-lg navbar-default shadow-sm py-lg-1 py-2">
          <div className="container-fluid py-2 justify-content-end">

            <NavLink className="me-lg-4 me-auto p-0 active p-0" to="/">
              <img height="40" src={LogoTBRCC} className="header-logo" alt="The Blue Red" />
            </NavLink>

            <span className="d-block ms-auto d-lg-none">
              <UserBox authData={authData} currentUserData={currentUserData} />
            </span>

            <button className="navbar-toggler collapsed border-0 fs-1" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-default" aria-controls="navbar-default" aria-expanded="false" aria-label="Toggle navigation">
              <i className="bi bi-list"></i>
              <i className="bi bi-x"></i>
            </button>

            <div className="collapse navbar-collapse pt-3 pt-lg-0" id="navbar-default">
              <ul className="navbar-nav">
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle link-dark" href="#" data-bs-toggle="dropdown">
                    Briefs
                  </a>
                  <ul className="dropdown-menu border-0 shadow-sm">
                    <div className="list-group">
                      {
                        currentUserData.forms.length > 0
                          ?
                          currentUserData.forms.map((brief, briefIndex) =>
                            <NavLink key={briefIndex} to={`/client/form/${brief.id}`} className="list-group-item list-group-item-action border-0 px-3" href="#">
                              <h6 className="mb-0 text-truncate">{brief.title}</h6>
                              <p className="mb-0 small text-truncate text-muted">
                                {brief.description}
                              </p>
                            </NavLink>
                          )
                          :
                          <div className="list-group-item border-0">
                            <span className="text-muted small">Henüz Boş</span>
                          </div>
                      }
                    </div>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle link-dark" href="#" data-bs-toggle="dropdown">
                    Presentations
                  </a>
                  <ul className="dropdown-menu border-0 shadow-sm">
                    <div className="list-group">
                      {
                        currentUserData.presentations.length > 0
                          ?
                          currentUserData.presentations.map((presentation, presentationIndex) =>
                            <NavLink key={presentationIndex} to={`/client/presentation/${presentation.id}`} className="list-group-item list-group-item-action border-0 px-3" href="#">
                              <h6 className="mb-0 text-truncate">{presentation.title}</h6>
                              <p className="mb-0 small text-truncate text-muted">
                                {presentation.description}
                              </p>
                            </NavLink>
                          )
                          :
                          <div className="list-group-item border-0">
                            <span className="text-muted small">Henüz Boş</span>
                          </div>
                      }
                    </div>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle link-dark" href="#" data-bs-toggle="dropdown">
                    Deliverables
                  </a>
                  <ul className="dropdown-menu border-0 shadow-sm">
                    <div className="list-group">
                      {
                        currentUserData.storages.length > 0
                          ?
                          currentUserData.storages.map((storage, storageIndex) =>
                            <NavLink key={storageIndex} to={`/client/storage/${storage.id}`} className="list-group-item list-group-item-action border-0 px-3" href="#">
                              <h6 className="mb-0 text-truncate">{storage.title}</h6>
                              <p className="mb-0 small text-truncate text-muted">
                                {storage.description}
                              </p>
                            </NavLink>
                          )
                          :
                          <div className="list-group-item border-0">
                            <span className="text-muted small">Henüz Boş</span>
                          </div>
                      }
                    </div>
                  </ul>
                </li>
              </ul>
              {currentPageTitle
                ? <span className="badge bg-secondary ms-2 d-none d-lg-inline">{currentPageTitle}</span>
                : <></>}
              <span className="d-none d-lg-block ms-auto">
                <UserBox authData={authData} currentUserData={currentUserData} />
              </span>
            </div>
          </div>
          {currentPageTitle
            ? <span className="mt-2 badge bg-secondary rounded-0 py-2 d-lg-none w-100 text-center" style={{ marginBottom: "-8px" }}>{currentPageTitle}</span>
            : <></>}
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

        <ImageModal src={imageModalSrc} />

        <UserDashFooter />
      </div>
      : <LoadingSpinner />
  )
}

function UserBox({ authData, currentUserData }) {
  const history = useHistory();
  const logout = (e) => {
    localStorage.removeItem(JWT_LOCALSTORAGE_NAME);
    history.push('/');
    window.location.reload();
  }

  return authData.isAdmin === "1"
    ? <></>
    :
    <div className="dropdown user-box">
      <a href="#" className="d-flex align-items-center py-0 link-dark text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
        <div className="d-none d-lg-flex flex-column text-end">
          <div>{currentUserData.firstname} {currentUserData.lastname}</div>
          <div className="small text-muted">{currentUserData.email}</div>
        </div>
        <div className="ms-2">
          <UserAvatar avatar={currentUserData.avatar} size="38" />
        </div>
      </a>
      <ul className="dropdown-menu text-small border-0 shadow-sm w-100" style={{right: "0px"}} aria-labelledby="dropdownUser1">
        <li><NavLink className="dropdown-item" to="/client/settings">Settings</NavLink></li>
        <li><hr className="dropdown-divider bg-light" /></li>
        <li><a className="dropdown-item" href="#" onClick={(e) => logout(e)}>Sign out</a></li>
      </ul>
    </div>;
}

function UserDashFooter() {
  return (
    <div className="brief-footer no-print">
      <div className="container-brief pb-1">
        <div className="site-info text-center py-2">
          <a href="http://thebluered.co.uk/" title="TheBlueRed" className="text-decoration-none text-muted" style={{ fontSize: "11px" }} target="_blank" rel="noreferrer">
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


export default UserDashboard;