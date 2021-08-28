import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { NavLink } from "react-router-dom";
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import UserService from '../services/userService';
import { setAllUsers, setUserPagination } from '../store/userSlice';
import { setCurrentPageTitle } from '../store/utilsSlice';

export default function UsersPage() {
  const users = useSelector((state) => state.users.all);
  const pagination = useSelector((state) => state.users.pagination);

  const [currentPage, setCurrentPage] = useState(1);

  const [sortBy, setSortBy] = useState(localStorage.getItem('sort_by_form') || "id");

  const [direction, setDirection] = useState(localStorage.getItem('direction_form') || "DESC");

  const [isLoad, setIsLoad] = useState(false)

  const dispatch = useDispatch();

  const userService = new UserService();

  useEffect(() => {
    dispatch(setCurrentPageTitle("User List"));
    if (users === undefined || users === null || users.length === 0) {
      userService.getAllUsers().then(res => {
        dispatch(setAllUsers(res.users));
        dispatch(setUserPagination({
          page: res.page,
          total: res.total,
          limit: res.limit,
        }));
        setIsLoad(true);
      });
    } else {
      setIsLoad(true);
    }
  }, [])

  const goPage = (page = 1, sort_by = "id", direction = "DESC") => {
    setIsLoad(false);
    userService.getAllUsers({ page: page, sort_by: sort_by, direction: direction }).then(res => {
      dispatch(setAllUsers(res.users));
      setIsLoad(true);
    });
    setCurrentPage(page);
    setDirection(direction);
    setSortBy(sort_by);
    setIsLoad(true);
  }

  return (
    <div className="form-page">
      <div className="d-flex align-items-center">
        <h2>User List</h2>
        <NavLink className="btn btn-sm btn-dark ms-auto" to={"/admin/user-add"}>Yeni Ekle</NavLink>
      </div>

      {isLoad
        ?
        <>
          <table className="table table-hover">
            <thead className="sticky-top bg-light" style={{ top: "54px", zIndex: "0" }}>
              <tr>
                <th scope="col" onClick={(e) => goPage(currentPage, "id", direction === "DESC" ? "ASC" : "DESC")} className="cursor">
                  id
                  {sortBy === "id" ? (direction === "DESC" ? <span>&uarr;</span> : <span>&darr;</span>) : ""}
                </th>
                <th scope="col" onClick={(e) => goPage(currentPage, "email", direction === "DESC" ? "ASC" : "DESC")} className="cursor">
                  email
                  {sortBy === "email" ? (direction === "DESC" ? <span>&uarr;</span> : <span>&darr;</span>) : ""}
                </th>
                <th scope="col" onClick={(e) => goPage(currentPage, "firstname", direction === "DESC" ? "ASC" : "DESC")} className="cursor">
                  firstname
                  {sortBy === "firstname" ? (direction === "DESC" ? <span>&uarr;</span> : <span>&darr;</span>) : ""}
                </th>
                <th scope="col" onClick={(e) => goPage(currentPage, "lastname", direction === "DESC" ? "ASC" : "DESC")} className="cursor">
                  lastname
                  {sortBy === "lastname" ? (direction === "DESC" ? <span>&uarr;</span> : <span>&darr;</span>) : ""}
                </th>
                <th scope="col" onClick={(e) => goPage(currentPage, "lastLoginDate", direction === "DESC" ? "ASC" : "DESC")} className="cursor">
                  lastLoginDate
                  {sortBy === "lastLoginDate" ? (direction === "DESC" ? <span>&uarr;</span> : <span>&darr;</span>) : ""}
                </th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <th scope="row">{user.id}</th>
                  <td>{user.email}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.lastLoginDate}</td>
                  <td className="d-flex justify-content-end">
                    <NavLink className="btn btn-secondary btn-sm" to={`user-edit/${user.id}`}>
                      Edit
                    </NavLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination pagination={pagination} currentPage={currentPage} goPage={goPage} />
        </>
        :
        <LoadingSpinner />
      }
    </div>
  )
}
