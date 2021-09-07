import { createSlice } from '@reduxjs/toolkit'

export const utilSlice = createSlice({
  name: 'utils',
  initialState: {
    currentPageTitle: "Client Central",
    imageModalSrc: null,
  },
  reducers: {
    setCurrentPageTitle: (state, { payload }) => {
      state.currentPageTitle = payload;
    },
    setImageModalSrc: (state, {payload}) => {
      state.imageModalSrc = payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setCurrentPageTitle, setImageModalSrc } = utilSlice.actions

export default utilSlice.reducer
