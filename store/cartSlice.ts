import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PostgrestError } from '@supabase/supabase-js';
import { RootState } from '.';
import { supabase } from '$lib/supabase';
import { Cart } from '$types/cart';
import { ProductMinimal } from '$types/product';

interface InitialState {
	error?: string;
	state: 'IDLE' | 'LOADING';
	items: Cart[];
}

const initialState: InitialState = {
	state: 'IDLE',
	items: []
};

export const fetchCartOfUser = createAsyncThunk<
	Cart[] | undefined,
	void,
	{ rejectValue: string }
>('cart/fetchByUserId', async (_, thunkAPI) => {
	const user = supabase.auth.user();

	if (!user) {
		return thunkAPI.rejectWithValue('You must log in to get your cart.');
	}

	const { data, error } = await supabase
		.from('cart')
		.select('*, product: products (id, name, price)')
		.eq('user_id', user.id);

	if (error) {
		return thunkAPI.rejectWithValue(error.message);
	}

	return data;
});

export const clearCartOfUser = createAsyncThunk<
	void,
	void,
	{ rejectValue: string }
>('cart/clearByUserId', async (_, thunkAPI) => {
	const user = supabase.auth.user();

	if (!user) {
		return thunkAPI.rejectWithValue('You must log in to clear your cart.');
	}

	const { error } = await supabase
		.from('cart')
		.delete({ returning: 'minimal' })
		.eq('user_id', user.id);

	if (error) {
		return thunkAPI.rejectWithValue(error.message);
	}
});

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		addItemToCart: (state, action: PayloadAction<Cart>) => {
			state.items.push({
				id: action.payload.id,
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
	},
	extraReducers: (builder) => {
		builder.addCase(fetchCartOfUser.fulfilled, (state, action) => {
			state.items = action.payload || [];
		});

		builder.addCase(fetchCartOfUser.rejected, (state, action) => {
			state.error = action.payload;
		});
	}
});

export const { addItemToCart, setCartItems, removeItemFromCart } =
	cartSlice.actions;

export const getAllCartItems = (state: RootState) => state.cart.items;

export const getNumOfItemsInCart = (state: RootState) =>
	state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const getTotalCartPrice = (state: RootState) =>
	state.cart.items.reduce(
		(total, item) => total + item.product.price * item.quantity,
		0
	);

export const cartReducer = cartSlice.reducer;
