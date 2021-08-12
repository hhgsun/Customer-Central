import { createSlice } from '@reduxjs/toolkit'

export const utilSlice = createSlice({
  name: 'utils',
  initialState: {
    currentPageTitle: "Client Central"
  },
  reducers: {
    setCurrentPageTitle: (state, { payload }) => {
      state.currentPageTitle = payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setCurrentPageTitle } = utilSlice.actions

export default utilSlice.reducer
