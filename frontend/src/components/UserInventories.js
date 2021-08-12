import React from 'react'
import { NavLink } from 'react-router-dom'

export default function UserInventories({ userData }) {

  return (
    <div className="accordion my-4 container" id="accordionPanelsStayOpenExample">
      <div className="accordion-item">
        <h2 className="accordion-header" id="panelhead-1">
          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panel-1" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
            Briefs
          </button>
        </h2>
        <div id="panel-1" className="accordion-collapse collapse show" aria-labelledby="panelhead-1">
          <div className="accordion-body">

            <div className="list-group">
              {userData.forms.length === 0 ? <small className="text-muted text-center">Henüz Boş</small> : ""}
              {userData.forms.map((form, formIndex) =>
                <NavLink key={formIndex} to={`/client/form/${form.id}`} className="list-group-item list-group-item-action">
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{form.title}</h5>
                    <small className="text-muted">{form.updateDate}</small>
                  </div>
                  <small className="text-muted">{form.isAnswered ? "Answered" : "Not Answered"}</small>
                </NavLink>
              )}
            </div>

          </div>
        </div>
      </div>
      <div className="accordion-item">
        <h2 className="accordion-header" id="panelhead-2">
          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panel-2" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
            Presentations
          </button>
        </h2>
        <div id="panel-2" className="accordion-collapse collapse show" aria-labelledby="panelhead-2">
          <div className="accordion-body">

            <div className="list-group">
              {userData.presentations.length === 0 ? <small className="text-muted text-center">Henüz Boş</small> : ""}
              {userData.presentations.map((presentation, presentationIndex) =>
                <NavLink key={presentationIndex} to={`/client/presentation/${presentation.id}`} className="list-group-item list-group-item-action">
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{presentation.title}</h5>
                    <small className="text-muted">{presentation.updateDate}</small>
                  </div>
                </NavLink>
              )}
            </div>

          </div>
        </div>
      </div>
      <div className="accordion-item">
        <h2 className="accordion-header" id="panelhead-3">
          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panel-3" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
            Storages
          </button>
        </h2>
        <div id="panel-3" className="accordion-collapse collapse show" aria-labelledby="panelhead-3">
          <div className="accordion-body">

            <div className="list-group">
              {userData.storages.length === 0 ? <small className="text-muted text-center">Henüz Boş</small> : ""}
              {userData.storages.map((storage, storageIndex) =>
                <NavLink key={storageIndex} to={`/client/storage/${storage.id}`} className="list-group-item list-group-item-action">
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{storage.title}</h5>
                    <small className="text-muted">{storage.updateDate}</small>
                  </div>
                </NavLink>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
