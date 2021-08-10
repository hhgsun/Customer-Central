import { createSlice } from '@reduxjs/toolkit'

export const storageSlice = createSlice({
  name: 'storages',
  initialState: {
    all: [],
    pagination: {}
  },
  reducers: {
    setAllStorages: (state, action) => {
      state.all = action.payload;
    },
    setStoragePagination: (state, action) => {
      state.pagination = action.payload;
    },
    addStorage: (state, action) => {
      state.all = [action.payload].concat(state.all);
    },
    deleteStorage: (state, {payload}) => {
      state.all.splice(payload, 1);
    },
    updateStorage: (state, {payload}) => {
      const index = state.all.findIndex(f => f.id === payload.id);
      state.all[index] = payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setAllStorages, setStoragePagination, addStorage, deleteStorage, updateStorage } = storageSlice.actions

export default storageSlice.reducer
