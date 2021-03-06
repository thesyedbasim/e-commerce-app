import Stripe from 'stripe';

export const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;

export const initStripe = () =>
	new Stripe(stripeSecretKey, { apiVersion: '2020-08-27' });
