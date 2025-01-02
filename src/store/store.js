import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import templateReducer from './slices/templateSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    templates: templateReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
