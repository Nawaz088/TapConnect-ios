import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  data: Object | null
  otherData: Object | null
}

const initialState: UserState = {
  data: {},
  otherData: {},
};

const userSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setUserData(state, action) {
      state.data = action.payload;
    },
    setOtherUsersData(state, action) {
      state.otherData = action.payload
    },
  },
});

export const { setUserData, setOtherUsersData } = userSlice.actions;
export default userSlice.reducer;
