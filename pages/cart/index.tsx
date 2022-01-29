import type { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
	getAllCartItems,
	getNumOfItemsInCart,
	getTotalCartPrice,
	removeItemFromCart,
	setCartItems
} from '../../app/store/cartSlice';
import { supabase } from '../../lib/supabase';

const Cart: NextPage = () => {
	const dispatch = useAppDispatch();

	const cartItems = useAppSelector(getAllCartItems);
	const numOfItemsInCart = useAppSelector(getNumOfItemsInCart);
	const totalCartPrice = useAppSelector(getTotalCartPrice);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	let user = supabase.auth.user();

	const fetchAndSetCartItems = async () => {
		if (!user) return;

		setIsLoading(true);

		const { data, error: sbError } = await supabase
			.from('cart')
			.select('*, product: products (id, name, price)')
			.eq('user_id', user.id);

		setIsLoading(false);

		if (sbError) {
			setError('There was some error fetching cart items.');

			return;
		}

		dispatch(setCartItems(data));
	};

	const deleteCartItems = async (cartItemId: number) => {
		if (!user) return;

		const { error: sbError } = await supabase
			.from('cart')
			.delete({ returning: 'minimal' })
			.eq('id', cartItemId)
			.eq('user_id', user.id);

		if (sbError) {
			setError('There was some problem removing that item from cart.');

			return;
		}

		dispatch(removeItemFromCart({ cartItemId }));
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
		return <h3>Loading...</h3>;
	}

	return (
		<>
			{!numOfItemsInCart && <h3>There are no items in your cart.</h3>}
			{numOfItemsInCart > 0 && (
				<>
					<h3>Total price: ${totalCartPrice}</h3>
					<Link href="/checkout">
						<button className="btn btn-primary">Checkout</button>
					</Link>
				</>
			)}
			{cartItems.map((cartItem) => (
				<div
					key={cartItem.id || Date.toString()}
					className="card mb-3"
					style={{ maxWidth: '540px' }}
				>
					<div className="row g-0">
						<div className="col-md-4">
							<img src="..." className="img-fluid rounded-start" alt="..." />
						</div>
						<div className="col-md-8">
							<div className="card-body">
								<a href={`/product/${cartItem.product.id}`}>
									<h5 className="card-title">{cartItem.product.name}</h5>
								</a>
								<p className="card-text">{cartItem.product.price}</p>
								<p className="card-text">quantity: {cartItem.quantity}</p>
								<button
									className="btn btn-danger"
									onClick={() => deleteCartItems(cartItem.id)}
								>
									Remove from cart
								</button>
							</div>
						</div>
					</div>
				</div>
			))}
		</>
	);
};

export default Cart;
