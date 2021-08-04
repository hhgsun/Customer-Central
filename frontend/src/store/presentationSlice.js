import { createSlice } from '@reduxjs/toolkit'

export const presentationSlice = createSlice({
  name: 'presentations',
  initialState: {
    all: [],
    pagination: {
      total: 50,
      limit: 50,
      page: 1
    }
  },
  reducers: {
    setAllPresentations: (state, action) => {
      state.all = action.payload;
    },
    setPresentationsPagination: (state, action) => {
      state.pagination = action.payload;
    },
    addPresentation: (state, action) => {
      state.all = [action.payload].concat(state.all);
    },
    deletePresentation: (state, { payload }) => {
      state.all.splice(payload, 1);
    },
    updatePresentation: (state, { payload }) => {
      const index = state.all.findIndex(f => f.id === payload.id);
      state.all[index] = payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  setAllPresentations, setPresentationsPagination, addPresentation, deletePresentation, updatePresentation
} = presentationSlice.actions

export default presentationSlice.reducer
