import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { stripe } from '$lib/stripe';

const createStripeProduct = async (stripe: Stripe) => {
	await stripe.products.create({}, {});
};

const Products = async (req: NextApiRequest, res: NextApiResponse) => {};
