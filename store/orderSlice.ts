import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '.';
import { Order } from '$lib/types/order';

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
		},
		addOrder: (state, action: PayloadAction<Order>) => {
			if (state.orders.find((order) => order.id === action.payload.id)) return;

			state.orders.push(action.payload);
		}
	}
});

export const { setOrders, addOrder } = orderSlice.actions;

export const getAllOrders = (state: RootState) => state.order.orders;
export const getOrderById = (id: Order['id']) => (state: RootState) => {
	console.log('the state by getting order by id', state.order.orders);
	return state.order.orders.find((order) => order.id === id);
};

export const orderReducer = orderSlice.reducer;
