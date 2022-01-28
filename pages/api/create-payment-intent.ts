import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { User } from '@supabase/supabase-js';
import { supabase, getServiceSupabase } from '../../lib/supabase';
import { ProductMinimal } from '../../lib/types/product';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2020-08-27'
});

const CreatePaymentIntent = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const getCartTotalPrice = async () => {
		const { user } = await supabase.auth.api.getUserByCookie(req);

		if (!user) {
			res.status(401).send('Please authenticate before checkout.');

			return;
		}

		console.log('cookie user', user);

		const supabaseService = getServiceSupabase();

		const { data, error } = await supabaseService
			.from('cart')
			.select('*, products!inner(price)')
			.eq('user_id', user?.id);

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
		res.status(400).send('No items in cart');
		return;
	}

	totalPrice = getTotalPrice(data) * 100;

	console.log('totalPrice', totalPrice);

	const paymentIntent = await stripe.paymentIntents.create({
		currency: 'USD',
		amount: totalPrice,
		automatic_payment_methods: { enabled: true }
	});

	res.json({ clientSecret: paymentIntent.client_secret });
};

export default CreatePaymentIntent;
