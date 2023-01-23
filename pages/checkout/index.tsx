import type { NextPage } from 'next';
import { useRouter } from 'next/router';
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

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const CheckoutPage: NextPage = () => {
	const router = useRouter();
	const dispatch = useAppDispatch();

	const userCart = useAppSelector(getAllCartItems);

	const user = supabase.auth.user();

	const CHECKOUT_METHOD = !user ? 'CART_LOCAL' : 'CART_DB';

	const [clientSecret, setClientSecret] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');

	useEffect(() => {
		const userUid = supabase.auth.user()?.id;

		if (!userUid) {
			const cartItems = JSON.parse(
				localStorage.getItem('cart') || JSON.stringify([])
			) as Cart[];

			dispatch(setCartItems(cartItems as Cart[]));
			dispatch(setCartItemsFetchStatus('FETCHED'));
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
			<div className="d-flex justify-content-center row">
				<div className="card col-10 col-md-8">
					<div className="card-body">
						<h1 className="card-title mb-3">Checkout</h1>
						{error && <p>{error}</p>}
						{!error && clientSecret && (
							<Elements stripe={stripePromise} options={{ clientSecret }}>
								<CheckoutForm />
							</Elements>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default CheckoutPage;
