import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '$lib/supabase';
import axios, { AxiosError } from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../../components/checkout/CheckoutForm';

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const CheckoutPage: NextPage = () => {
	const router = useRouter();

	const [clientSecret, setClientSecret] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');

	useEffect(() => {
		const userUid = supabase.auth.user()?.id;

		if (!userUid) {
			router.replace('/');

			return;
		}

		axios
			.post(
				'/api/stripe/payment-intents',
				{},
				{ headers: { userUid, orderMethod: 'CART' } }
			)
			.then((res) => {
				setClientSecret(res.data.clientSecret);
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
			<h1>Checkout page</h1>
			{error && <p>{error}</p>}
			{!error && clientSecret && (
				<Elements stripe={stripePromise} options={{ clientSecret }}>
					<CheckoutForm />
				</Elements>
			)}
		</>
	);
};

export default CheckoutPage;
