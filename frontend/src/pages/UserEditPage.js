import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import UserInventories from '../components/UserInventories';
import UserModel from '../models/UserModel';
import UserService from '../services/userService';
import UserEdit from '../components/UserEdit';

export default function UserEditPage() {
  const { userId } = useParams()

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

  return (
    <div className="user-edit-page">
      {
        isLoad
          ?
          <>
            <UserEdit userData={userData} setUserData={setUserData} isAdmin={true} />
            <UserInventories userData={userData} />
          </>
          :
          <LoadingSpinner />
      }
    </div>
  )
}
