import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { NavLink, useParams } from 'react-router-dom';
import UserModel from '../models/UserModel';
import UserService from '../services/userService';
import { updateUser } from '../store/userSlice';

export default function UserEditPage() {
  const { userId } = useParams()

  const dispacth = useDispatch()

  const [userData, setUserData] = useState(new UserModel());

  const [isLoad, setIsLoad] = useState(false);

  const userService = new UserService();

  useEffect(() => {
    if (userId) {
      userService.getUserDetail(userId).then(res => {
        setUserData(Object.assign({}, new UserModel(res)));
        setIsLoad(true);
      })
    } else {
      setIsLoad(true);
    }
  }, [])

  const sendUpdateUser = () => {
    if (!userData.firstname || !userData.lastname || !userData.email) {
      alert("Lütfen Bilgileri Belirtin.");
      return;
    }
    userService.updateUser(userData).then(r => {
      dispacth(updateUser(userData));
      alert("Güncelleme Başarılı");
    })
  }

  const handleInput = (e) => {
    setUserData(prevState => ({
      ...userData,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="user-edit-page">
      {
        isLoad
          ?
          <>
            <div className="info-settings" style={{ maxWidth: "750px" }}>

              <div className="mb-1 row">
                <label htmlFor="input_email" className="col-sm-2 col-form-label">E-Mail</label>
                <div className="col-sm-10">
                  <input type="text" className="form-control form-control-sm" id="input_email" name="email" value={userData.email} onChange={(e) => handleInput(e)} disabled />
                </div>
              </div>

              <div className="mb-1 row">
                <label htmlFor="input_ad" className="col-sm-2 col-form-label">Ad-Soyad</label>
                <div className="col-sm-5">
                  <input type="text" className="form-control form-control-sm" id="input_ad" name="firstname" value={userData.firstname} onChange={(e) => handleInput(e)} />
                </div>
                <div className="col-sm-5">
                  <input type="text" className="form-control form-control-sm" name="lastname" value={userData.lastname} onChange={(e) => handleInput(e)} />
                </div>
              </div>

              <button className="btn btn-sm btn-dark" onClick={(e) => sendUpdateUser()}>KAYDET</button>

            </div>

            <div className="accordion mt-4" id="accordionPanelsStayOpenExample">
              <div className="accordion-item">
                <h2 className="accordion-header" id="panelhead-1">
                  <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panel-1" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                    Briefs
                  </button>
                </h2>
                <div id="panel-1" className="accordion-collapse collapse show" aria-labelledby="panelhead-1">
                  <div className="accordion-body">

                    <div className="list-group">
                      {userData.forms.map((form, formIndex) =>
                        <NavLink key={formIndex} to={`/form/${form.id}`} target={'_blank'} className="list-group-item list-group-item-action">
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
                      {userData.presentations.map((presentation, presentationIndex) =>
                        <NavLink key={presentationIndex} to={`/presentation/${presentation.id}`} target={'_blank'} className="list-group-item list-group-item-action">
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
                      {userData.storages.map((storage, storageIndex) =>
                        <NavLink key={storageIndex} to={`/storage/${storage.id}`} target={'_blank'} className="list-group-item list-group-item-action">
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
          </>
          :
          <div className="p-5">Bekleyiniz...</div>
      }
    </div>
  )
}
