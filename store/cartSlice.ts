import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Cart } from '$lib/types/cart';
import { RootState } from '$store';

interface InitialState {
	error?: string;
	state: 'IDLE' | 'LOADING' | 'FETCHED';
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
		},
		updateCartItemQuantity: (
			state,
			action: PayloadAction<{ itemId: Cart['id']; qty: Cart['quantity'] }>
		) => {
			const itemIndex = state.items.findIndex(
				(item) => item.id === action.payload.itemId
			);

			if (itemIndex < 0) return;

			const newCartItems = [...state.items];

			newCartItems[itemIndex].quantity = action.payload.qty;

			state.items = newCartItems;
		},
		setCartItemsFetchStatus: (
			state,
			action: PayloadAction<InitialState['state']>
		) => {
			state.state = action.payload;
		}
	}
});

export const {
	addItemToCart,
	setCartItems,
	removeItemFromCart,
	updateCartItemQuantity,
	setCartItemsFetchStatus
} = cartSlice.actions;

export const getAllCartItems = (state: RootState) => state.cart.items;

export const getNumOfItemsInCart = (state: RootState): number =>
	state.cart.items.length;

export const getTotalCartPrice = (state: RootState): number =>
	+state.cart.items
		.reduce((total, item) => total + item.product.price * item.quantity, 0)
		.toFixed(2);

export const getCartItemsFetchStatus = (state: RootState) => state.cart.state;

export const cartReducer = cartSlice.reducer;
