import { createSlice } from '@reduxjs/toolkit'

export const clientSlice = createSlice({
  name: 'clients',
  initialState: {
    all: [],
    pagination: {}
  },
  reducers: {
    setAllClients: (state, action) => {
      state.all = action.payload;
    },
    setClientPagination: (state, action) => {
      state.pagination = action.payload;
    },
    addClient: (state, action) => {
      state.all = [action.payload].concat(state.all);
    },
    deleteClient: (state, {payload}) => {
      state.all.splice(payload, 1);
    },
    updateClient: (state, {payload}) => {
      const index = state.all.findIndex(f => f.id === payload.id);
      state.all[index] = payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setAllClients, setClientPagination, addClient, deleteClient, updateClient } = clientSlice.actions

export default clientSlice.reducer
