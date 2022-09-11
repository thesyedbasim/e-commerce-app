import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';
import { Review, ReviewMinimal } from '$lib/types/review';
import { supabase } from '$lib/supabase';

interface InitialState {
	error?: string;
	state: 'IDLE' | 'LOADING';
	reviews: Review[];
}

const initialState: InitialState = {
	state: 'IDLE',
	reviews: []
};

const reviewSlice = createSlice({
	name: 'review',
	initialState,
	reducers: {
		addReview: (state, action: PayloadAction<Review>) => {
			state.reviews.push(action.payload);
		},
		setReviews: (state, action: PayloadAction<Review[]>) => {
			state.reviews = action.payload;
		},
		removeReview: (state, action: PayloadAction<Review['id']>) => {
			state.reviews = state.reviews.filter(
				(review) => review.id !== action.payload
			);
		}
	}
});

export const { addReview, setReviews, removeReview } = reviewSlice.actions;

export const getAllReviewsOfProduct =
	(productId: string) =>
	(state: RootState): Review[] =>
		state.review.reviews.filter((review) => review.product === productId);

export const reviewReducer = reviewSlice.reducer;
