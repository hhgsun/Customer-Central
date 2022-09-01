
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { NavLink, Route, Switch, useHistory } from "react-router-dom";
import { JWT_LOCALSTORAGE_NAME } from "../../config";
import FormEditPage from "../../pages/FormEditPage";
import FormsPage from "../../pages/FormsPage";
import PresentationEditPage from "../../pages/PresentationEditPage";
import PresentationsPage from "../../pages/PresentationsPage";
import StorageEditPage from "../../pages/StorageEditPage";
import StoragesPage from "../../pages/StoragesPage";
import UserEditPage from "../../pages/UserEditPage";
import UsersPage from "../../pages/UsersPage";
import { setCurrentPageTitle } from "../../store/utilsSlice";
import LogoImg from "../../images/logo.png";

function AdminDashboard({ match }) {
  let history = useHistory();

  useEffect(() => {
    const sidebar = document.getElementById("sidebarMenu");
    sidebar.addEventListener("click", (e) => {
      if (sidebar.classList.contains("show")) {
        sidebar.classList.remove("show");
      }
    })
  }, [])

  const logout = (e) => {
    localStorage.removeItem(JWT_LOCALSTORAGE_NAME);
    history.push('/');
    window.location.reload();
  }
  return <div className="admin-dashboard">
    <header className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap px-3 shadow">
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
                <NavLink exact activeClassName="active" className="nav-link" to="/admin"><i className="bi bi-house-door"></i>Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink activeClassName="active" className="nav-link" to="/admin/forms"><i className="bi bi-ui-checks-grid"></i>Brief Central</NavLink>
              </li>
              <li className="nav-item">
                <NavLink activeClassName="active" className="nav-link" to="/admin/presentations"><i className="bi bi-easel"></i>Presentation Central</NavLink>
              </li>
              <li className="nav-item">
                <NavLink activeClassName="active" className="nav-link" to="/admin/storages"><i className="bi bi-hdd"></i>Storage Central</NavLink>
              </li>
              <li className="nav-item">
                <NavLink activeClassName="active" className="nav-link" to="/admin/users"><i className="bi bi-people"></i>Users</NavLink>
              </li>
              <li className="mt-auto">
                <a href="#" className="nav-link" onClick={(e) => logout(e)}><i className="bi bi-box-arrow-left"></i>Çıkış Yap</a>
              </li>
            </ul>
          </div>
        </nav>
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 pt-3" style={{ marginTop: "55px" }}>
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
            <Route path={`${match.url}/user-add`}>
              <UserEditPage />
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



function HomeAdmin() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCurrentPageTitle("Client Central Admin"));
  }, [])
  return (
    <div className="px-4 py-5 my-5 text-center">
      <img height="60" src={LogoImg} className="header-logo" alt="Client Center" loading="lazy" />

      <h1 className="display-5 fw-bold mt-3 mb-4">Client Central</h1>
      <div className="col-lg-6 mx-auto">
        <p className="lead mb-4">Müşteri ihtiyaçlarını yönetebilmek için özenle hazırlanmış panel.</p>
      </div>
    </div>
  );
}

export default AdminDashboard;