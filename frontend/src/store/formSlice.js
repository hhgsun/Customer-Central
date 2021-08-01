import { createSlice } from '@reduxjs/toolkit'

export const formSlice = createSlice({
  name: 'forms',
  initialState: {
    all: [],
    pagination: {
      total: 50,
      limit: 50,
      page: 1
    }
  },
  reducers: {
    setAllForms: (state, action) => {
      state.all = action.payload;
    },
    setFormsPagination: (state, action) => {
      state.pagination = action.payload;
    },
    addForm: (state, action) => {
      state.all = [action.payload].concat(state.all);
    },
    deleteForm: (state, { payload }) => {
      state.all.splice(payload, 1);
    },
    updateForm: (state, { payload }) => {
      const index = state.all.findIndex(f => f.id === payload.id);
      state.all[index] = payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setAllForms, setFormsPagination, addForm, deleteForm, updateForm } = formSlice.actions

export default formSlice.reducer
