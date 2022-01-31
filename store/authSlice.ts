import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@supabase/supabase-js';
import { RootState } from '.';
import { supabase } from '$lib/supabase';

interface InitialState {
	user: User | null;
}

const initialState: InitialState = {
	user: supabase.auth.user()
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setAuthUser: (state, action: PayloadAction<InitialState['user']>) => {
			state.user = action.payload;
		}
	}
});

export const { setAuthUser } = authSlice.actions;

export const getAuthUser = (state: RootState) => state.auth.user;

export const authReducer = authSlice.reducer;
