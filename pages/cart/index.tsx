import type { NextPage } from 'next';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
	getAllCartItems,
	getNumOfItemsInCart,
	getTotalCartPrice,
	removeItemFromCart,
	setCartItems,
	updateCartItemQuantity
} from '../../store/cartSlice';
import { supabase } from '$lib/supabase';
import { ProductMinimal } from '$lib/types/product';
import { Cart, CartDB } from '$lib/types/cart';
import debounce from 'lodash/debounce';
import Loader from 'components/misc/Loading';

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

	const updateQuantityDB = async (
		itemId: Cart['id'],
		qty: Cart['quantity']
	) => {
		const user = supabase.auth.user();

		if (!user) return;

		console.log(user.id);

		const { error: sbError } = await supabase
			.from<CartDB>('cart')
			.update({ quantity: qty })
			.eq('id', itemId)
			.eq('user', user.id);

		if (sbError) {
			console.error(sbError);

			setIsLoading(false);
			setError(sbError.message);

			return;
		}
	};

	const updateQuantityHandler = useCallback(
		debounce(
			async (itemId: Cart['id'], qty: Cart['quantity']) =>
				await updateQuantityDB(itemId, qty),
			1000
		),
		[]
	);

	const updateQuantity = async (itemId: Cart['id'], qty: Cart['quantity']) => {
		await updateQuantityHandler(itemId, qty);

		dispatch(updateCartItemQuantity({ itemId, qty }));
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
												onChange={(e) => {
													if (+e.target.value < 0) return;

													updateQuantity(cartItem.id, +e.target.value);
												}}
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
									<Link href="/checkout" passHref={true}>
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
