import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';
import { Cart } from '../../lib/types/cart';
import { ProductMinimal } from '../../lib/types/product';

interface InitialState {
	items: Cart[];
}

const initialState: InitialState = {
	items: []
};

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		addItemToCart: (
			state,
			action: PayloadAction<{ quantity: number; product: ProductMinimal }>
		) => {
			state.items.push({
				id: new Date().getMilliseconds(),
				quantity: action.payload.quantity,
				product: action.payload.product
			});
		},
		setCartItems: (state, action: PayloadAction<Cart[]>) => {
			state.items = action.payload;
		},
		removeItemFromCart: (
			state,
			action: PayloadAction<{ cartItemId: number }>
		) => {
			state.items = state.items.filter(
				(item) => item.id !== action.payload.cartItemId
			);
		}
	}
});

export const { addItemToCart, removeItemFromCart } = cartSlice.actions;

export const getAllCartItems = (state: RootState) => state.cart.items;

export const getNumOfItemsInCart = (state: RootState) =>
	state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const getTotalCartPrice = (state: RootState) =>
	state.cart.items.reduce((total, item) => total + item.product.price, 0);

export default cartSlice.reducer;
