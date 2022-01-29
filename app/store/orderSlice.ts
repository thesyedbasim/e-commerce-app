import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '.';
import { Order } from '../../lib/types/order';

interface InitialState {
	orders: Order[];
}

const initialState: InitialState = {
	orders: []
};

const orderSlice = createSlice({
	name: 'order',
	initialState,
	reducers: {
		setOrders: (state, action: PayloadAction<Order[]>) => {
			state.orders = action.payload;
		}
	}
});

export const { setOrders } = orderSlice.actions;

export const getAllOrders = (state: RootState) => state.order.orders;

export const orderReducer = orderSlice.reducer;
