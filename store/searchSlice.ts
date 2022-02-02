import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';
import { ProductMinimal } from '$lib/types/product';

interface InitialState {
	items: ProductMinimal[];
}

const initialState: InitialState = {
	items: []
};

const searchSlice = createSlice({
	name: 'search',
	initialState,
	reducers: {
		setSearchItems: (state, action: PayloadAction<ProductMinimal[]>) => {
			state.items = action.payload;
		}
	}
});

export const { setSearchItems } = searchSlice.actions;

export const getAllSearchItems = (state: RootState) => {
	return state.search.items;
};

export const searchReducer = searchSlice.reducer;
