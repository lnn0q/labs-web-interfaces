import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import fandomReducer from './fandomSlice';
import chatReducer from './chatSlice';
import postReducer from './postSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    fandoms: fandomReducer,
    chat: chatReducer,
    posts: postReducer,
  },
});
