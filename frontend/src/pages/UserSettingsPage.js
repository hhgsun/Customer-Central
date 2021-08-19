import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUserData } from '../store/userSlice';
import { setCurrentPageTitle } from '../store/utilsSlice';
import UserEdit from '../components/UserEdit';

export default function UserSettingsPage() {
  const dispatch = useDispatch()

  const currentUserData = useSelector(state => state.users.currentUserData);

  useEffect(() => {
    dispatch(setCurrentPageTitle("Setting User"));
  }, [])

  const setData = (data) => {
    dispatch(setCurrentUserData(data))
  }

  return (
    <div className="user-settings-page">
      {
        <UserEdit userData={currentUserData} setUserData={setData} />
      }
    </div>
  )
}
