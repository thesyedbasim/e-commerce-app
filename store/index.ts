import { configureStore } from '@reduxjs/toolkit';

import { cartReducer } from './cartSlice';
import { authReducer } from './authSlice';
import { orderReducer } from './orderSlice';
import { reviewReducer } from './reviewSlice';

export const store = configureStore({
	reducer: {
		cart: cartReducer,
		auth: authReducer,
		order: orderReducer,
		review: reviewReducer
	}
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
