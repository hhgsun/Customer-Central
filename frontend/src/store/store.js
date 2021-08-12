import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import formSlice from './formSlice'
import presentationSlice from "./presentationSlice";
import storageSlice from './storageSlice';
import userSlice from './userSlice';
import utilsSlice from "./utilsSlice";

export default configureStore({
  reducer: {
    forms: formSlice,
    auth: authSlice,
    storages: storageSlice,
    presentations: presentationSlice,
    users: userSlice,
    utils: utilsSlice
  },
})
