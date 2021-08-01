import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuth: false,
  },
  reducers: {
    authLogin: (state) => {
      state.isAuth = true
    },
    authLogout: (state) => {
      state.isAuth = false
    },
  },
})

// Action creators are generated for each case reducer function
export const { authLogin, authLogout } = authSlice.actions

export default authSlice.reducer
