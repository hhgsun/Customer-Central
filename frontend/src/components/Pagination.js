import React from 'react'

export default function Pagination({ pagination, currentPage, goPage }) {

  return pagination ?
    pagination.total > 0 ?
      <nav>
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
      </nav>
      :
      <div className="text-center text-muted">Henüz Boş</div>
    : <></>
}
