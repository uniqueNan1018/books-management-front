import { configureStore } from '@reduxjs/toolkit';
import userReducer from './stores/userSlice';
import categoryReducer from './stores/categorySlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    category: categoryReducer,
  },
});

// 型定義（React 用フックで使う）
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;