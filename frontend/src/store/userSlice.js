import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'users',
  initialState: {
    all: [],
    pagination: {},
    currentUserData: null,
  },
  reducers: {
    setAllUsers: (state, action) => {
      state.all = action.payload;
    },
    setUserPagination: (state, action) => {
      state.pagination = action.payload;
    },
    addUser: (state, action) => {
      state.all = [action.payload].concat(state.all);
    },
    deleteUser: (state, { payload }) => {
      state.all.splice(payload, 1);
    },
    updateUser: (state, { payload }) => {
      const index = state.all.findIndex(f => f.id === payload.id);
      state.all[index] = payload;
    },
    setCurrentUserData: (state, { payload }) => {
      state.currentUserData = payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setAllUsers, setUserPagination, addUser, deleteUser, updateUser, setCurrentUserData } = userSlice.actions

export default userSlice.reducer
