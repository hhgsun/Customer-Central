import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import StorageService from '../services/storageService';
import { setAllStorages, setStoragePagination } from '../store/storageSlice';
import { setCurrentPageTitle } from '../store/utilsSlice';

export default function StoragesPage() {
  const users = useSelector((state) => state.users.all);
  const storages = useSelector((state) => state.storages.all);
  const pagination = useSelector((state) => state.storages.pagination);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(localStorage.getItem('sort_by_storage') || "id");
  const [direction, setDirection] = useState(localStorage.getItem('direction_storage') || "DESC");
  const [isLoad, setIsLoad] = useState(false)

  const dispatch = useDispatch();

  const storageService = new StorageService();

  useEffect(() => {
    dispatch(setCurrentPageTitle("Storage Central"));
    if (storages === undefined || storages === null || storages.length === 0) {
      storageService.getAllStorages().then(res => {
        dispatch(setAllStorages(res.storages));
        dispatch(setStoragePagination({
          page: res.page,
          total: res.total,
          limit: res.limit,
        }));
        setIsLoad(true);
      });
    } else {
      setIsLoad(true);
    }
  }, []);

  const goPage = (page = 1, sort_by = "id", direction = "DESC") => {
    setIsLoad(false);
    storageService.getAllStorages({ page: page, sort_by: sort_by, direction: direction }).then(res => {
      dispatch(setAllStorages(res.storages));
      setIsLoad(true);
    });
    setCurrentPage(page);
    setDirection(direction);
    setSortBy(sort_by);
    setIsLoad(true);
  }

  return (
    <div className="storages-page">
      <div className="d-flex align-items-center">
        <h2>Storage List</h2>
        <NavLink className="btn btn-sm btn-dark ms-auto" to={"/admin/storage-add"}>Yeni Ekle</NavLink>
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
                <th scope="col" onClick={(e) => goPage(currentPage, "title", direction === "DESC" ? "ASC" : "DESC")} className="cursor">
                  title
                  {sortBy === "title" ? (direction === "DESC" ? <span>&uarr;</span> : <span>&darr;</span>) : ""}
                </th>
                <th scope="col" onClick={(e) => goPage(currentPage, "createdDate", direction === "DESC" ? "ASC" : "DESC")} className="cursor">
                  createdDate
                  {sortBy === "createdDate" ? (direction === "DESC" ? <span>&uarr;</span> : <span>&darr;</span>) : ""}
                </th>
                <th scope="col" onClick={(e) => goPage(currentPage, "updateDate", direction === "DESC" ? "ASC" : "DESC")} className="cursor">
                  updateDate
                  {sortBy === "updateDate" ? (direction === "DESC" ? <span>&uarr;</span> : <span>&darr;</span>) : ""}
                </th>
                <th scope="col">
                  User
                </th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {storages.map((storage, index) => (
                <tr key={index}>
                  <th scope="row">{storage.id}</th>
                  <td>{storage.title}</td>
                  <td>{storage.createdDate}</td>
                  <td>{storage.updateDate}</td>
                  <td>{storage.userId === "0"
                    ? ""
                    : users.filter(u => u.id === storage.userId).length > 0
                      ? users.filter(u => u.id === storage.userId)[0].email
                      : ""}
                  </td>
                  <td className="d-flex justify-content-end">
                    <NavLink className="btn btn-secondary btn-sm" to={`storage-edit/${storage.id}`}>
                      Edit
                    </NavLink>
                    <NavLink className="btn btn-light btn-sm ms-2" to={`/client/storage/${storage.id}`} target={'_blank'}>
                      View
                    </NavLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pagination ? <nav className="">
            <span className="badge bg-secondary ms-auto">Toplam: {pagination.total}</span>
            <ul className="pagination my-5">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <span className="page-link cursor" onClick={(e) => goPage(currentPage - 1)}>Previous</span>
              </li>
              {
                [...Array(Math.ceil(pagination.total / pagination.limit)).keys()].map(pageNumber =>
                  <li key={pageNumber} className={`page-item ${pageNumber + 1 === currentPage ? "active disabled" : ""}`}>
                    <span className="page-link cursor" onClick={(e) => goPage(pageNumber + 1)}>{pageNumber + 1}</span>
                  </li>
                )
              }
              <li className={`page-item ${currentPage === Math.ceil(pagination.total / pagination.limit) ? "disabled" : ""}`}>
                <span className="page-link cursor" onClick={(e) => goPage(currentPage + 1)}>Next</span>
              </li>
            </ul>
          </nav> : <></>}
        </>
        :
        <LoadingSpinner />
      }
    </div>
  )
}
