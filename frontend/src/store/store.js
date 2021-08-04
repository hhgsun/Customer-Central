import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import counterReducer from './counterSlice'
import formSlice from './formSlice'
import clientSlice from "./clientSlice";
import presentationSlice from "./presentationSlice";

export default configureStore({
  reducer: {
    counter: counterReducer,
    forms: formSlice,
    auth: authSlice,
    clients: clientSlice,
    presentations: presentationSlice,
  },
})
