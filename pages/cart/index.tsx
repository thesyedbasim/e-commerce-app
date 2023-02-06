import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useAppDispatch, useAppSelector } from '$lib/hooks';
import { supabase } from '$lib/supabase';
import type { Cart } from '$lib/types/cart';
import {
	getCartItemsFetchStatus,
	getNumOfItemsInCart,
	setCartItems,
	setCartItemsFetchStatus
} from '$store/cartSlice';

import CartView from '@components/cart/CartView';
import Loader from '@ui/Loading';

const Cart: NextPage = () => {
	const dispatch = useAppDispatch();

	const numOfItemsInCart = useAppSelector(getNumOfItemsInCart);
	const cartItemsFetchStatus = useAppSelector(getCartItemsFetchStatus);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	let user = supabase.auth.user();

	const fetchAndSetCartItems = async () => {
		if (!user) {
			const cartItems = JSON.parse(
				localStorage.getItem('cart') || JSON.stringify([])
			) as Cart[];

			dispatch(setCartItems(cartItems as Cart[]));
			dispatch(setCartItemsFetchStatus('FETCHED'));

			return;
		}

		setIsLoading(true);

		const { data, error: sbError } = await supabase
			.from('cart')
			.select('*, product (id, name, price)')
			.eq('user', user.id);

		setIsLoading(false);

		if (sbError) {
			console.error('error while reading cart', sbError);
			setError('There was some error fetching cart items.');

			return;
		}

		dispatch(setCartItems(data as Cart[]));
		dispatch(setCartItemsFetchStatus('FETCHED'));
	};

	useEffect(() => {
		if (cartItemsFetchStatus === 'FETCHED') return;

		fetchAndSetCartItems();
	}, []);

	supabase.auth.onAuthStateChange((event) => {
		if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
			dispatch(setCartItems([]));

			return;
		}

		fetchAndSetCartItems();
	});

	if (error) {
		return <h1>Oops! There was an error fetching your cart.</h1>;
	}

	if (isLoading) {
		return <Loader />;
	}

	if (!numOfItemsInCart) return <h3>There are no items in your cart.</h3>;

	return (
		<>
			<CartView setIsLoading={setIsLoading} setError={setError} />
		</>
	);
};

export default Cart;
