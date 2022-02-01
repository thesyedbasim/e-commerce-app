import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { stripe } from '$lib/stripe';
import { getServiceSupabase } from '$lib/supabase';

const supabaseService = getServiceSupabase();

const createStripeProduct = async ({
	name,
	description,
	productId
}: {
	name: string;
	description: string;
	productId: number;
}) => {
	const product = await stripe.products.create({
		name,
		description,
		metadata: {
			productId
		}
	});

	return product;
};

const createStripePrice = async ({
	unitAmount,
	productStripeId
}: {
	unitAmount: number;
	productStripeId: string;
}) => {
	const price = await stripe.prices.create({
		currency: 'usd',
		unit_amount: unitAmount,
		product: productStripeId
	});

	return price;
};

const setStripeProductInDb = async (id: number, stripeProductId: string) => {
	const { data, error } = await supabaseService
		.from('products')
		.update({ stripeProduct: stripeProductId })
		.eq('id', id);

	if (error) throw error;

	return data;
};

const Products = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST')
		return res.status(406).json({ message: 'Invalid request method.' });

	const { id, name, price: productPrice, description } = req.body.record;

	const product = await createStripeProduct({
		name,
		description,
		productId: id
	});

	await createStripePrice({
		unitAmount: productPrice * 100,
		productStripeId: product.id
	});

	setStripeProductInDb(id, product.id);

	res.status(201).json({ message: 'Product created successfully.' });
};

export default Products;
