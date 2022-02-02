import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';
import { Cart } from '$lib/types/cart';

interface InitialState {
	error?: string;
	state: 'IDLE' | 'LOADING';
	items: Cart[];
}

const initialState: InitialState = {
	state: 'IDLE',
	items: []
};

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		addItemToCart: (state, action: PayloadAction<Cart>) => {
			state.items.push(action.payload);
		},
		setCartItems: (state, action: PayloadAction<Cart[]>) => {
			state.items = action.payload;
		},
		removeItemFromCart: (
			state,
			action: PayloadAction<{ cartItemId: Cart['id'] }>
		) => {
			state.items = state.items.filter(
				(item) => item.id !== action.payload.cartItemId
			);
		}
	}
});

export const { addItemToCart, setCartItems, removeItemFromCart } =
	cartSlice.actions;

export const getAllCartItems = (state: RootState) => state.cart.items;

export const getNumOfItemsInCart = (state: RootState): number =>
	state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const getTotalCartPrice = (state: RootState): number =>
	state.cart.items.reduce(
		(total, item) => total + item.product.price * item.quantity,
		0
	);

export const cartReducer = cartSlice.reducer;
