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
} from '../../store/cartSlice';
import { supabase } from '$lib/supabase';
import { ProductMinimal } from '$lib/types/product';
import { Cart } from '$lib/types/cart';

const Cart: NextPage = () => {
	const dispatch = useAppDispatch();

	const cartItems = useAppSelector(getAllCartItems);
	const numOfItemsInCart = useAppSelector(getNumOfItemsInCart);
	const totalCartPrice = useAppSelector(getTotalCartPrice);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	let user = supabase.auth.user();

	const getProductURL = (id: ProductMinimal['id']) => {
		const { data, error } = supabase.storage
			.from('images')
			.getPublicUrl(`products/${id}`);

		if (error) {
			console.error(error);
			return;
		}

		return data?.publicURL;
	};

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

	const deleteCartItems = async (cartItemId: number) => {
		if (!user) return;

		const { error: sbError } = await supabase
			.from('cart')
			.delete({ returning: 'minimal' })
			.eq('id', cartItemId)
			.eq('user', user.id);

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
			<div className="row">
				<div className="col-9">
					<table className="table">
						<thead>
							<tr>
								<th></th>
								<th></th>
								<th className="text-end">Price</th>
							</tr>
						</thead>
						<tbody>
							{cartItems.map((cartItem) => (
								<tr key={cartItem.id}>
									<td className="col-3">
										<img
											src={getProductURL(cartItem.product.id)}
											alt={cartItem.product.name}
											className="img-thumbnail"
										/>
									</td>
									<td>
										<h4>{cartItem.product.name}</h4>
										<div className="quantity col-2">
											<label>Quantity:</label>
											<input
												type="number"
												className="form-control"
												value={cartItem.quantity}
											/>
										</div>
										<div
											className="btn btn-danger mt-3"
											onClick={() => deleteCartItems(cartItem.id)}
										>
											Remove
										</div>
									</td>
									<td className="fs-4 text-end fw-bold">
										${cartItem.product.price}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className="col-3">
					<div className="card">
						<div className="card-body">
							{numOfItemsInCart > 0 && (
								<>
									<h3 className="text-center">
										<span className="fs-5">Total price:</span> ${totalCartPrice}
									</h3>
									<Link href="/checkout">
										<button className="btn btn-primary w-100">Checkout</button>
									</Link>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Cart;
