import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from '../components/LoadingSpinner';
import UserInventories from '../components/UserInventories';
import { setCurrentPageTitle } from '../store/utilsSlice';

export default function UserViewPage() {

  const dispatch = useDispatch();

  const currentUserData = useSelector(state => state.users.currentUserData);

  useEffect(() => {
    dispatch(setCurrentPageTitle(null));
  }, [])

  return (
    <div className="user-view-page">
      {
        currentUserData
          ?
          <>
            <UserInventories userData={currentUserData} />
          </>
          :
          <LoadingSpinner />
      }
    </div>
  )
}
