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

	let { method, product, qty } = router.query;

	if (!method || (method !== 'CART' && method !== 'BUY')) method = 'CART';

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
				{ product, qty },
				{ headers: { userUid, orderMethod: method as string } }
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
