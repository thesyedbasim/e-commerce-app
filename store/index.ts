import { configureStore } from '@reduxjs/toolkit';

import { cartReducer } from './cartSlice';
import { authReducer } from './authSlice';
import { searchReducer } from './searchSlice';
import { orderReducer } from './orderSlice';

export const store = configureStore({
	reducer: {
		cart: cartReducer,
		auth: authReducer,
		search: searchReducer,
		order: orderReducer
	}
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
