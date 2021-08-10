import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import counterReducer from './counterSlice'
import formSlice from './formSlice'
import presentationSlice from "./presentationSlice";
import storageSlice from './storageSlice';
import userSlice from './userSlice';

export default configureStore({
  reducer: {
    counter: counterReducer,
    forms: formSlice,
    auth: authSlice,
    storages: storageSlice,
    presentations: presentationSlice,
    users: userSlice
  },
})
