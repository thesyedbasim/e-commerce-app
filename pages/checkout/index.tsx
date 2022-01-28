import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../../components/checkout/CheckoutForm';

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const CheckoutPage: NextPage = () => {
	const router = useRouter();

	const [clientSecret, setClientSecret] = useState<string>('');

	useEffect(() => {
		const userId = supabase.auth.user()?.id;

		if (!userId) {
			router.replace('/');

			return;
		}

		try {
			axios
				.post('/api/create-payment-intent', {}, { headers: { userId } })
				.then((res) => {
					console.log(res.data);
					setClientSecret(res.data.clientSecret);
				});
		} catch (err) {
			console.error(err);
		}
	}, []);

	return (
		<>
			<h1>Checkout page</h1>
			{clientSecret && (
				<Elements stripe={stripePromise} options={{ clientSecret }}>
					<CheckoutForm />
				</Elements>
			)}
		</>
	);
};

export default CheckoutPage;
