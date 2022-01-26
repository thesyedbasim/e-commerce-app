import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import authReducer from './authSlice';
import searchReducer from './searchSlice';

export const store = configureStore({
	reducer: {
		cart: cartReducer,
		auth: authReducer,
		search: searchReducer
	}
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
