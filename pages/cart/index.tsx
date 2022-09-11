import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getNumOfItemsInCart, setCartItems } from '../../store/cartSlice';
import { supabase } from '$lib/supabase';
import { Cart } from '$lib/types/cart';
import Loader from 'components/misc/Loading';
import CartSummary from 'components/cart/CartSummary';
import CartItemsSection from 'components/cart/CartItemsSection';

const Cart: NextPage = () => {
	const dispatch = useAppDispatch();

	const numOfItemsInCart = useAppSelector(getNumOfItemsInCart);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	let user = supabase.auth.user();

	const fetchAndSetCartItems = async () => {
		if (!user) return;

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
	};

	useEffect(() => {
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
			<h1 className="mb-3">My Cart</h1>
			<div className="row">
				<div className="col-9">
					<CartItemsSection setIsLoading={setIsLoading} setError={setError} />
				</div>
				<div className="col-3">
					<CartSummary />
				</div>
			</div>
		</>
	);
};

export default Cart;
