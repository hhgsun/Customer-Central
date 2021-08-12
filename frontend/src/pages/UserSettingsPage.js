import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from '../components/LoadingSpinner';
import UserService from '../services/userService';
import { setCurrentUserData } from '../store/userSlice';
import { setCurrentPageTitle } from '../store/utilsSlice';
import { toast } from 'react-toastify';

export default function UserSettingsPage() {
  const dispatch = useDispatch()

  const currentUserData = useSelector(state => state.users.currentUserData);

  const userService = new UserService();

  const [disabledBtn, setDisabledBtn] = useState(false)

  useEffect(() => {
    dispatch(setCurrentPageTitle("Setting User"));
  }, [])

  const handleInput = (e) => {
    dispatch(
      setCurrentUserData({
        ...currentUserData,
        [e.target.name]: e.target.value
      })
    )
  }

  const sendUpdateUser = () => {
    if (!currentUserData.firstname || !currentUserData.lastname || !currentUserData.email) {
      toast.warn("Lütfen bilgileri eksiksiz giriniz.")
      return;
    }
    setDisabledBtn(true);
    userService.updateUser(currentUserData).then(r => {
      dispatch(setCurrentUserData({ ...currentUserData }));
      setTimeout(() => {
        setDisabledBtn(false);
      }, 200);
      toast.success("Güncelleme Başarılı.")
    })
  }

  return (
    <div className="user-settings-page">
      {
        currentUserData
          ?
          <>
            <div className="info-settings container mt-3 mb-4 pb-4 border-bottom">

              <div className="mb-1 row">

                <label htmlFor="input_email" className="col-sm-2 col-form-label">E-Mail</label>
                <div className="col-sm-5">
                  <input type="text" className="form-control form-control-sm" id="input_email" name="email" value={currentUserData.email} onChange={(e) => handleInput(e)} disabled />
                </div>

              </div>

              <div className="mb-1 row">
                <label htmlFor="input_ad" className="col-sm-2 col-form-label">Ad</label>
                <div className="col-sm-5">
                  <input type="text" className="form-control form-control-sm" id="input_ad" name="firstname" value={currentUserData.firstname} onChange={(e) => handleInput(e)} />
                </div>
              </div>

              <div className="mb-1 row">
                <label htmlFor="input_sad" className="col-sm-2 col-form-label">Soyad</label>
                <div className="col-sm-5">
                  <input type="text" className="form-control form-control-sm" id="input_sad" name="lastname" value={currentUserData.lastname} onChange={(e) => handleInput(e)} />
                </div>
              </div>

              <button className="btn btn-sm btn-dark mt-3" onClick={(e) => sendUpdateUser()} disabled={disabledBtn}>KAYDET</button>

            </div>
          </>
          :
          <LoadingSpinner />
      }
    </div>
  )
}
