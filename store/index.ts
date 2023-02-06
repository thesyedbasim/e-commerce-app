import { configureStore } from '@reduxjs/toolkit';

import { cartReducer } from '$store/cartSlice';
import { authReducer } from '$store/authSlice';
import { orderReducer } from '$store/orderSlice';
import { reviewReducer } from '$store/reviewSlice';
import { wishlistReducer } from '$store/wishlistSlice';

export const store = configureStore({
	reducer: {
		cart: cartReducer,
		auth: authReducer,
		order: orderReducer,
		review: reviewReducer,
		wishlist: wishlistReducer
	}
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
