import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import counterReducer from './counterSlice'
import storeForms from './formSlice'
import clientSlice from "./clientSlice";

export default configureStore({
  reducer: {
    counter: counterReducer,
    forms: storeForms,
    auth: authSlice,
    clients: clientSlice
  },
})
