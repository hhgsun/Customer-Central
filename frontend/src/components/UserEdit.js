import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import UserService from '../services/userService';
import { setCurrentPageTitle } from '../store/utilsSlice';
import UserAvatar from './UserAvatar';
import { toast } from 'react-toastify';
import LoadingSpinner from './LoadingSpinner';
import AuthService from '../services/authService';
import { useHistory } from 'react-router-dom';

export default function UserEdit({ userData, setUserData, isAdmin = false }) {
  const history = useHistory();
  const dispatch = useDispatch()

  const userService = new UserService();
  const authService = new AuthService();

  const [disabledBtn, setDisabledBtn] = useState(false)

  const [avatarData, setAvatarData] = useState(userData.avatar);

  useEffect(() => {
    dispatch(setCurrentPageTitle("Setting User"));
  }, [])

  const sendUpdateUser = () => {
    if (userData.firstname === '' || userData.lastname === '' || userData.email === '') {
      toast.warn("Lütfen bilgileri eksiksiz giriniz.")
      return;
    }
    const newData = {
      ...userData,
      avatar: avatarData
    }
    setDisabledBtn(true);
    userService.updateUser(newData).then(r => {
      setUserData({ ...newData })
      setTimeout(() => {
        setDisabledBtn(false);
      }, 200);
      toast.success("Güncelleme Başarılı.")
    })
  }

  const sendNewUser = () => {
    if (userData.firstname === '' || userData.lastname === '' || userData.email === '' || userData.password === '') {
      toast.warn("Lütfen bilgileri eksiksiz giriniz.")
      return;
    }
    setDisabledBtn(true);
    authService.register(userData).then(r => {
      setTimeout(() => {
        history.push(`/admin/users`);
        window.location.reload();
      }, 400);
      toast.success("Ekleme Başarılı.")
    })
  }

  const handleInput = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    })
  }

  const handleCheckbox = (e) => {
    setUserData(prevState => ({
      ...userData,
      [e.target.name]: e.target.checked ? "1" : "0"
    }))
  }

  const handleAvatarImage = (e) => {
    if ([...e.target.files].length > 0) {
      const file = [...e.target.files][0];
      if (file) {
        const saveObj = {
          file: file,
          fileName: Date.now().toString() + "__" + file.name,
          newAddedUrl: URL.createObjectURL(file),
        };
        setAvatarData(saveObj);
      }
    }
  }

  const removeAvatar = (e) => {
    let c = window.confirm("Profil fotonuzun kaldırmak üzeresiniz");
    if (c) {
      setAvatarData(null);
    }
  }

  return (
    <div className="user-edit">
      {
        userData
          ?
          <>
            <div className="container mt-3 mb-4 pb-4 border-bottom">

              <div className="mb-1 row">

                <label htmlFor="input_email" className="col-sm-2 col-form-label">E-Mail yada K.Adı</label>
                <div className="col-sm-5">
                  <input type="text" className="form-control form-control-sm" id="input_email" name="email" value={userData.email} onChange={(e) => handleInput(e)} disabled={userData.id} />
                </div>

                {
                  isAdmin ?
                    <div className="form-check form-check-sm col-5">
                      <input className="form-check-input" type="checkbox" name="isAdmin" checked={userData.isAdmin === "1" ? true : false} onChange={(e) => handleCheckbox(e)} id="isAdminCheck" />
                      <label className="form-check-label" htmlFor="isAdminCheck">
                        is admin
                      </label>
                    </div>
                    : <></>
                }

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

              {
                userData.id
                  ?
                  <div className="mb-1 row">
                    <label htmlFor="input_pp" className="col-sm-2 col-form-label">Profil Resmi</label>
                    <div className="col-sm-5">
                      <div className="mb-2">
                        <UserAvatar avatar={avatarData} size="96" />
                        {avatarData !== null ? <button className="btn btn-sm p-0 fs-5" onClick={(e) => removeAvatar(e)} type="button" title="Kaldır"><i className="bi bi-trash"></i></button> : <></>}
                      </div>
                      <input type="file" className="form-control form-control-sm" id="input_pp" name="avatar" onChange={(e) => handleAvatarImage(e)} />
                    </div>
                  </div>
                  :
                  <div className="mb-1 row">
                    <label htmlFor="password" className="col-sm-2 col-form-label">Kullanıcı Şifresi</label>
                    <div className="col-sm-5">
                      <input type="text" className="form-control form-control-sm" id="password" name="password" value={userData.password} onChange={(e) => handleInput(e)} />
                    </div>
                  </div>
              }

              {
                userData.id
                  ?
                  <button className="btn btn-sm btn-dark mt-3" onClick={(e) => sendUpdateUser()} disabled={disabledBtn}>KAYDET</button>
                  :
                  <button className="btn btn-sm btn-dark mt-3" onClick={(e) => sendNewUser()} disabled={disabledBtn}>EKLE</button>
              }


            </div>
          </>
          :
          <LoadingSpinner />
      }
    </div>
  )
}
