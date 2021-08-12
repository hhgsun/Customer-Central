import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authData: null,
  },
  reducers: {
    authLogin: (state, { payload }) => {
      state.authData = payload;
    },
    authLogout: (state) => {
      state.authData = null;
    },
  },
})

// Action creators are generated for each case reducer function
export const { authLogin, authLogout } = authSlice.actions

export default authSlice.reducer
