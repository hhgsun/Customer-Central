import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

export default function UserInventories({ userData }) {

  const [tab, setTab] = useState(0)

  const tabMenuItems = [
    {
      title: "Briefs",
      desc: "All the briefs you filled are together in this central. You can reach and check out what you desired.",
      color: "var(--primary-bg)",
      btnText: "CHECK THE BRIEFS"
    },
    {
      title: "Presentations",
      desc: "All the briefs you filled are together in this central. You can reach and check out what you desired.",
      color: "var(--secondary-bg)",
      btnText: "CHECK THE PRESENTATIONS"
    },
    {
      title: "Deliverables",
      desc: "All the briefs you filled are together in this central. You can reach and check out what you desired.",
      color: "var(--dark-bg)",
      btnText: "REACH THE FILES"
    }
  ]

  return (<>
    <div className="user-inventories py-lg-5">
      <div className="container px-0 px-lg-2">
        <div className="tab-menu d-flex flex-md-nowrap flex-wrap justify-content-center text-light">
          {
            tabMenuItems.map((tabItem, tabItemIndex) =>
              <div key={tabItemIndex} className={`tab-item d-flex flex-md-column align-items-center p-3 p-lg-5 pb-0 pb-lg-0 mt-2 mx-lg-2 ${tab === tabItemIndex ? "active" : ""}`} style={{ backgroundColor: tabItem.color }}>
                <div className="w-100 mb-lg-4 mb-1">
                  <h2 className="h4 mb-lg-3 mt-lg-3 fw-bold">{tabItem.title}</h2>
                  <p>{tabItem.desc}</p>
                </div>
                <div className="ms-3 ms-md-0 d-flex flex-column mt-auto text-center" style={{minWidth: "150px"}}>
                  <button className="btn btn-sm btn-light rounded-pill py-2 py-lg-3 px-4 mb-lg-3 fw-bold" onClick={() => setTab(tabItemIndex)} style={{ color: tabItem.color }}>
                    {tabItem.btnText}
                  </button>
                  <i className={`bi bi-arrow-down-short fs-2 ${tab === tabItemIndex ? "visible" : "invisible"}`}></i>
                </div>
              </div>
            )
          }
        </div>
      </div>

      <div className="py-5 mt-2 mt-lg-4" style={{ backgroundColor: tabMenuItems[tab].color }}>
        <div className="tab-content pb-5 container" style={{ maxWidth: "800px" }}>
          <div className={`tab-pane ${tab === 0 ? "active" : ""}`}>
            <h2 className="display-6 fs-4 mb-4 text-light">Briefs</h2>
            <div className="list-group">
              {userData.forms.length === 0 ? <small className="text-muted text-center">Henüz Boş</small> : ""}
              {userData.forms.map((form, formIndex) =>
                <NavLink key={formIndex} to={`/client/form/${form.id}`} className="list-group-item list-group-item-action">
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{form.title}</h5>
                    <small className="text-muted">{form.updateDate}</small>
                  </div>
                  <p className="mb-0 text-muted">{form.description}</p>
                  <small className="text-muted">{form.isAnswered ? "Answered" : "Not Answered"}</small>
                </NavLink>
              )}
            </div>
          </div>
          <div className={`tab-pane ${tab === 1 ? "active" : ""}`}>
            <h2 className="display-6 fs-4 mb-4 text-light">Presentations</h2>
            <div className="list-group">
              {userData.presentations.length === 0 ? <small className="text-muted text-center">Henüz Boş</small> : ""}
              {userData.presentations.map((presentation, presentationIndex) =>
                <NavLink key={presentationIndex} to={`/client/presentation/${presentation.id}`} className="list-group-item list-group-item-action">
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{presentation.title}</h5>
                    <small className="text-muted">{presentation.updateDate}</small>
                  </div>
                  <p className="mb-0 text-muted">{presentation.description}</p>
                </NavLink>
              )}
            </div>
          </div>
          <div className={`tab-pane ${tab === 2 ? "active" : ""}`}>
            <h2 className="display-6 fs-4 mb-4 text-light">Deliverables</h2>
            <div className="list-group">
              {userData.storages.length === 0 ? <small className="text-muted text-center">Henüz Boş</small> : ""}
              {userData.storages.map((storage, storageIndex) =>
                <NavLink key={storageIndex} to={`/client/storage/${storage.id}`} className="list-group-item list-group-item-action">
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{storage.title}</h5>
                    <small className="text-muted">{storage.updateDate}</small>
                  </div>
                  <p className="mb-0 text-muted">{storage.description}</p>
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  </>
  )
}
