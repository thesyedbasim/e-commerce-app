import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import axios from 'axios';

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2020-08-27'
});

const StripeWebhook = async (req: NextApiRequest, res: NextApiResponse) => {
	const stripeWebookSigningSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET!;

	let event;

	const bodyBuf = await buffer(req);

	try {
		event = stripe.webhooks.constructEvent(
			bodyBuf,
			req.headers['stripe-signature']!,
			stripeWebookSigningSecret
		);

		console.log('stripe event inside try', event);
	} catch (err) {
		console.error('⚠ Stripe webhook validation failed.', err);

		res
			.status(403)
			.json({ message: 'You are not allowed to use this webhook.' });

		return;
	}

	switch (event.type) {
		case 'payment_intent.created':
			// try {
			// 	await axios.post('')
			// } catch(err) {
			// 	console.error('⚠ Error while creating order.')
			// }

			console.log('payment intent created.');

			console.log('THE EVENT OBJECT IS:');
			console.log(event);
		case 'payment_intent.payment_failed':
			console.log('payment intent fail');
		default:
			console.log(`unhandled event type: ${event.type}`);
	}

	res.send({ received: true });
};

export default StripeWebhook;
