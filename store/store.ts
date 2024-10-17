import { configureStore } from '@reduxjs/toolkit';
import contactsReducer from './Slice/contactsSlice';
import authReducer from './Slice/authSlice'
import userSlice from './Slice/userSlice';

const store = configureStore({
  reducer: {
    contacts: contactsReducer,
    auth: authReducer,
    user: userSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
