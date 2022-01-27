import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import axios from 'axios';

const CheckoutPage: NextPage = () => {
	const router = useRouter();

	useEffect(() => {
		const userId = supabase.auth.user()?.id;

		if (!userId) {
			router.replace('/');

			return;
		}

		axios.post('/api/create-payment-intent', {}, { headers: { userId } });
	}, []);

	return <h1>Checkout page</h1>;
};

export default CheckoutPage;
