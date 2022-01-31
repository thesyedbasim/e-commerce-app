import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { User } from '@supabase/supabase-js';
import { supabase, getServiceSupabase } from '$lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2020-08-27'
});

const CreatePaymentIntent = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const supabaseService = getServiceSupabase();
	const userId: User['id'] = req.headers.userid as User['id'];

	if (!userId) {
		res.status(401).json({ message: 'Please authenticate before checkout.' });

		return;
	}

	const { data: user } = await supabaseService.auth.api.getUserById(userId);

	if (!user) {
		res.status(406).json({ message: 'User not found with the id specified.' });

		return;
	}

	const { data: userProfile } = await supabaseService
		.from('profiles')
		.select('stripe_customer')
		.eq('id', user.id)
		.single();

	const getCartTotalPrice = async () => {
		const { data, error } = await supabaseService
			.from('cart')
			.select('*, products!inner(price)')
			.eq('user_id', user.id);

		if (!data || data.length === 0) return null;

		return data;
	};

	const getTotalPrice = (data: any[]) => {
		return data.reduce(
			(total, cart) => total + cart.products.price * cart.quantity,
			0
		);
	};

	const data = await getCartTotalPrice();
	let totalPrice: number;

	if (!data) {
		res.status(400).json({ message: 'No items in cart' });

		return;
	}

	totalPrice = getTotalPrice(data) * 100;

	try {
		const paymentIntent = await stripe.paymentIntents.create({
			currency: 'USD',
			amount: totalPrice,
			automatic_payment_methods: { enabled: true },
			customer: userProfile.stripe_customer
		});

		res.json({ clientSecret: paymentIntent.client_secret });
	} catch (err) {
		console.error('error while creating payment intent', err);

		res.status(400).json({ message: 'Unable to create payment intent.' });

		return;
	}

	return;
};

export default CreatePaymentIntent;
