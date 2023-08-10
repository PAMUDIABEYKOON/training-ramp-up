import { createSlice } from '@reduxjs/toolkit';


export const dataSlice = createSlice({
  name: 'data',
  initialState: { records: [], rowModesModel: {}, deletionSuccess: false },
  reducers: {
    setRows: (state, action) => {
      state.records = action.payload;
    },
    setRowModesModel: (state, action) => {
      state.rowModesModel = action.payload;
    },
    getStudentsSuccess: (state, action) => {
      state.records = action.payload;
    },
    setDeletionSuccess: (state, action) => {
      state.deletionSuccess = action.payload;
    },
  },
});

export const { setRows, setRowModesModel, getStudentsSuccess, setDeletionSuccess } = dataSlice.actions;
export default dataSlice.reducer;
