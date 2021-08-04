import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import PresentationService from '../services/presentationService';
import { setAllPresentations, setPresentationsPagination } from '../store/presentationSlice';

export default function PresentationsPage() {

  const presetations = useSelector((state) => state.presentations.all);
  const pagination = useSelector((state) => state.presentations.pagination);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(localStorage.getItem('sort_by_present') || "id");
  const [direction, setDirection] = useState(localStorage.getItem('direction_present') || "DESC");
  const [isLoad, setIsLoad] = useState(false)

  const dispatch = useDispatch();

  const presentService = new PresentationService();

  useEffect(() => {
    if (presetations === undefined || presetations === null || presetations.length === 0) {
      presentService.getAllPresentations().then(res => {
        dispatch(setAllPresentations(res.presentations));
        dispatch(setPresentationsPagination({
          page: res.page,
          total: res.total,
          limit: res.limit,
        }))
        setIsLoad(true);
      });
    } else {
      setIsLoad(true);
    }
  }, [])

  const goPage = (page = 1, sort_by = "id", direction = "DESC") => {
    setIsLoad(false);
    presentService.getAllPresentations({ page: page, sort_by: sort_by, direction: direction }).then(res => {
      dispatch(setAllPresentations(res.presentations));
    })
    setCurrentPage(page);
    setDirection(direction);
    setSortBy(sort_by);
    setIsLoad(true);
  }

  return (
    <div className="presentations-page">
      <div className="d-flex align-items-center">
        <h2>Presentation List</h2>
        <NavLink className="btn btn-sm btn-dark ms-auto" to={"/dashboard/presentation-add"}>Yeni Ekle</NavLink>
      </div>

      {isLoad
        ?
        <>
          <table className="table table-hover">
            <thead>
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
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {presetations.map((presetation, index) => (
                <tr key={index}>
                  <th scope="row">{presetation.id}</th>
                  <td>{presetation.title}</td>
                  <td>{presetation.createdDate}</td>
                  <td>{presetation.updateDate}</td>
                  <td className="d-flex justify-content-end">
                    <NavLink className="btn btn-secondary btn-sm" to={`presentation-edit/${presetation.id}`}>
                      Edit
                    </NavLink>
                    <NavLink className="btn btn-light btn-sm ms-2" to={`/presentation/${presetation.id}`} target={'_blank'}>
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
        "Yükleniyor..."
      }
    </div>
  )
}
