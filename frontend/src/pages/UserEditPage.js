import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import UserInventories from '../components/UserInventories';
import UserModel from '../models/UserModel';
import UserService from '../services/userService';
import { updateUser } from '../store/userSlice';
import { toast } from 'react-toastify';

export default function UserEditPage() {
  const { userId } = useParams()

  const dispacth = useDispatch()

  const [userData, setUserData] = useState(new UserModel());

  const [isLoad, setIsLoad] = useState(false);

  const [disabledBtn, setDisabledBtn] = useState(false)

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
      toast.warn("Lütfen Bilgileri Belirtin.")
      return;
    }
    setDisabledBtn(true);
    userService.updateUser(userData).then(r => {
      dispacth(updateUser(userData));
      setTimeout(() => {
        setDisabledBtn(false);
      }, 200);
      toast.success("Güncelleme Başarılı.")
    })
  }

  const handleInput = (e) => {
    setUserData(prevState => ({
      ...userData,
      [e.target.name]: e.target.value
    }))
  }

  const handleCheckbox = (e) => {
    setUserData(prevState => ({
      ...userData,
      [e.target.name]: e.target.checked ? "1" : "0"
    }))
  }

  return (
    <div className="user-edit-page">
      {
        isLoad
          ?
          <>
            <div className="info-settings container mt-3 mb-4 pb-4 border-bottom">

              <div className="mb-1 row">

                <label htmlFor="input_email" className="col-sm-2 col-form-label">E-Mail</label>
                <div className="col-sm-5">
                  <input type="text" className="form-control form-control-sm" id="input_email" name="email" value={userData.email} onChange={(e) => handleInput(e)} disabled />
                </div>

                <div className="form-check form-check-sm col-5">
                  <input className="form-check-input" type="checkbox" name="isAdmin" checked={userData.isAdmin === "1" ? true : false} onChange={(e) => handleCheckbox(e)} id="isAdminCheck" />
                  <label className="form-check-label" htmlFor="isAdminCheck">
                    is admin
                  </label>
                </div>

              </div>

              <div className="mb-1 row">
                <label htmlFor="input_ad" className="col-sm-2 col-form-label">Ad</label>
                <div className="col-sm-5">
                  <input type="text" className="form-control form-control-sm" id="input_ad" name="firstname" value={userData.firstname} onChange={(e) => handleInput(e)} />
                </div>
              </div>

              <div className="mb-1 row">
                <label htmlFor="input_sad" className="col-sm-2 col-form-label">Soyad</label>
                <div className="col-sm-5">
                  <input type="text" className="form-control form-control-sm" id="input_sad" name="lastname" value={userData.lastname} onChange={(e) => handleInput(e)} />
                </div>
              </div>

              <button className="btn btn-sm btn-dark mt-3" onClick={(e) => sendUpdateUser()} disabled={disabledBtn}>KAYDET</button>

            </div>

            <UserInventories userData={userData} />
          </>
          :
          <LoadingSpinner />
      }
    </div>
  )
}
