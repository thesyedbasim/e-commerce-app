import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2020-08-27'
});

const CreatePaymentIntent = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const getCartTotalPrice = async () => {
		const { user } = await supabase.auth.api.getUserByCookie(req);
		console.log(user);

		const { data, error } = await supabase.from('cart').select('*');

		console.log('data', data);

		if (!data || data.length === 0) return;

		return;
	};

	const totalPrice = await getCartTotalPrice();
	console.log('totalPrice', totalPrice);

	// const paymentIntent = await stripe.paymentIntents.create({
	// 	currency: 'USD',
	// 	amount: req.body.amount,
	// 	automatic_payment_methods: { enabled: true }
	// });

	// res.json({ clientSecret: paymentIntent.client_secret });

	res.send('hi');
};

export default CreatePaymentIntent;
