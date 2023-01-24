import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { supabase } from '$lib/supabase';
import axios, { AxiosError } from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../../components/checkout/CheckoutForm';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
	getAllCartItems,
	setCartItems,
	setCartItemsFetchStatus
} from '$store/cartSlice';
import { Cart } from '$lib/types/cart';
import CartItemCheckout from '@components/checkout/CartItemCheckout';

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const CheckoutPage: NextPage = () => {
	const dispatch = useAppDispatch();

	const userCart = useAppSelector(getAllCartItems);

	const user = supabase.auth.user();

	const CHECKOUT_METHOD = !user ? 'CART_LOCAL' : 'CART_DB';

	const [clientSecret, setClientSecret] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');
	const [cartError, setCartError] = useState<string>('');
	const [subtotal, setSubtotal] = useState<number>(0);

	useEffect(() => {
		const userUid = supabase.auth.user()?.id;

		if (!userUid) {
			const cartItems = JSON.parse(
				localStorage.getItem('cart') || JSON.stringify([])
			) as Cart[];

			dispatch(setCartItems(cartItems as Cart[]));
			dispatch(setCartItemsFetchStatus('FETCHED'));

			setSubtotal(
				userCart.reduce(
					(total, cartItem) =>
						total + cartItem.product.price * cartItem.quantity,
					0
				)
			);
		}

		axios
			.post(
				'/api/stripe/payment-intents',
				{ userCart },
				{
					headers: { userUid: userUid || 'false', orderMethod: CHECKOUT_METHOD }
				}
			)
			.then((res) => {
				setClientSecret(res.data.clientSecret);
				console.log(res.data);
			})
			.catch((err: AxiosError) => {
				console.error(err);
				setError(
					err.response?.data.message ||
						'There was some problem in the checkout process.'
				);
			});
	}, []);

	return (
		<>
			<div className="grid grid-cols-[1.5fr,1fr] gap-16">
				<div className="grid auto-rows-max gap-6">
					<h1 className="text-2xl font-bold">Checkout</h1>
					{error && <p>{error}</p>}
					{!error && clientSecret && (
						<Elements
							stripe={stripePromise}
							options={{
								clientSecret,
								appearance: {
									rules: {
										'.Input': {
											borderColor: '#d1d5db',
											borderRadius: '0',
											borderWidth: '2px',
											boxShadow: 'none'
										},
										'.Input:hover': {
											borderColor: '#9ca3af',
											outline: 'none'
										},
										'.Input:focus': {
											borderColor: '#9ca3af',
											outline: 'none'
										}
									}
								}
							}}
						>
							<CheckoutForm />
						</Elements>
					)}
				</div>
				<div className="px-12 py-12 bg-stone-50">
					<div className="h-full w-full">
						<div className="border-gray-100 pb-3">
							<div className="grid grid-cols-2 items-center">
								<p className="text-gray-400">Subtotal:</p>
								<p className="font-bold text-lg justify-self-end">
									${subtotal}
								</p>
							</div>
						</div>
						<div className="border-t-2 border-b-2 border-gray-200 py-3">
							<div className="grid grid-cols-2 items-center">
								<p className="text-gray-400">Total:</p>
								<p className="font-bold text-2xl justify-self-end">
									${subtotal}
								</p>
							</div>
						</div>
						<div className="mt-8">
							{userCart.map((cartItem) => (
								<CartItemCheckout
									key={cartItem.id}
									cartItem={cartItem}
									setIsLoading={setIsLoading}
									setError={setCartError}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default CheckoutPage;
