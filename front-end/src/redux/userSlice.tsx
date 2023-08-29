import { createSlice } from '@reduxjs/toolkit';

const Users = [
  {
    username: 'admin@gmail.com',
    password: '1234',
    role: 'admin',
  },
];

const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: Users,
    userRole: null,
    currentUser: null,
  },
  reducers: {
    setUserRole: (state, action) => {
      state.userRole = action.payload;
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});

export const { setUserRole, addUser, setCurrentUser } = userSlice.actions;

export default userSlice.reducer;
