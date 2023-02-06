import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Wishlist } from '$lib/types/wishlist';
import type { Product } from '$lib/types/product';
import type { RootState } from '$store';

interface InitialState {
	wishlist: Wishlist[];
}

const initialState: InitialState = {
	wishlist: []
};

const wishlistSlice = createSlice({
	name: 'wishlist',
	initialState,
	reducers: {
		setWishlist: (state, action: PayloadAction<Wishlist[]>) => {
			state.wishlist = action.payload;
		},
		addWishlistItem: (state, action: PayloadAction<Wishlist>) => {
			if (
				state.wishlist.find(
					(wishlistItem) => wishlistItem.id === action.payload.id
				)
			)
				return;

			state.wishlist.push(action.payload);
		},
		removeWishlistItem: (
			state,
			action: PayloadAction<{ productId: Product['id'] }>
		) => {
			state.wishlist = state.wishlist.filter(
				(wishlistItem) => wishlistItem.product.id !== action.payload.productId
			);
		}
	}
});

export const { setWishlist, addWishlistItem, removeWishlistItem } =
	wishlistSlice.actions;

export const getWishlist = (state: RootState) => state.wishlist.wishlist;

export const getIsProductInWishlist =
	(productId: Product['id']) => (state: RootState) => {
		return state.wishlist.wishlist.find(
			(wishlistItem) => wishlistItem.product.id === productId
		) === undefined
			? false
			: true;
	};

export const wishlistReducer = wishlistSlice.reducer;
