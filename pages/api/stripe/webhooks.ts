import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import axios from 'axios';
import { createOrder } from './orders';

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2020-08-27'
});

const StripeWebhook = async (req: NextApiRequest, res: NextApiResponse) => {
	const stripeWebookSigningSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET!;
	const stripeSignature = req.headers['stripe-signature'] as string;

	const reqBuffer = await buffer(req);

	let event;
	try {
		event = stripe.webhooks.constructEvent(
			reqBuffer,
			stripeSignature,
			stripeWebookSigningSecret
		);
	} catch (err) {
		console.error('⚠ Stripe webhook validation failed.', err);

		res
			.status(403)
			.json({ message: 'You are not allowed to use this webhook.' });

		return;
	}

	switch (event.type) {
		case 'payment_intent.succeeded':
			const dataObj = event.data.object as any;

			await createOrder({
				amount: dataObj.amount / 100,
				products: JSON.parse(dataObj.metadata.products),
				userUid: dataObj.metadata.userUid
			});

			break;
		case 'payment_intent.payment_failed':
			console.log('payment intent fail');
			console.log(event);

			break;
		default:
			console.log(`unhandled event type: ${event.type}`);
	}

	res.send({ received: true });
};

export default StripeWebhook;
