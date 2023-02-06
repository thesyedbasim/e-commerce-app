import { useEffect, useState } from 'react';
import { supabase } from '$lib/supabase';
import { useAppDispatch, useAppSelector } from '$lib/hooks';
import type { Cart } from '$lib/types/cart';
import {
	getCartItemsFetchStatus,
	getNumOfItemsInCart,
	setCartItems,
	setCartItemsFetchStatus
} from '$store/cartSlice';

import NavDesktop from '@components/layout/nav/NavDesktop';
import NavMobile from '@components/layout/nav/NavMobile';

const Navbar: React.FC = () => {
	const dispatch = useAppDispatch();

	const numOfItemsInCart = useAppSelector(getNumOfItemsInCart);
	const cartItemsFetchStatus = useAppSelector(getCartItemsFetchStatus);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);

	let user = supabase.auth.user();

	useEffect(() => {
		if (!user) setIsUserLoggedIn(false);
		else setIsUserLoggedIn(true);
	}, [user]);

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

	const [isScreenWidthMatching, setIsScreenWidthMatching] =
		useState<boolean>(false);

	useEffect(() => {
		window.addEventListener('resize', () =>
			setIsScreenWidthMatching(window.matchMedia('(min-width: 768px)').matches)
		);

		setIsScreenWidthMatching(window.matchMedia('(min-width: 768px)').matches);

		return () => window.removeEventListener('resize', () => {});
	}, []);

	return (
		<>
			{isScreenWidthMatching ? (
				<NavDesktop
					numOfItemsInCart={numOfItemsInCart}
					isUserLoggedIn={isUserLoggedIn}
				/>
			) : (
				<NavMobile
					numOfItemsInCart={numOfItemsInCart}
					isUserLoggedIn={isUserLoggedIn}
				/>
			)}
		</>
	);
};

export default Navbar;
