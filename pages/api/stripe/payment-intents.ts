import { NextApiRequest, NextApiResponse } from 'next';
import { initStripe } from '$lib/stripe';
import { getServiceSupabase } from '$lib/supabase';
import { Cart } from '$lib/types/cart';
import { Product } from '$lib/types/product';

const stripe = initStripe();
const supabaseService = getServiceSupabase();

const createPaymentIntent = async ({
	amount,
	customerId,
	userUid = null,
	products
}: {
	amount: number;
	customerId?: string;
	userUid?: string | null;
	products: any[];
}) => {
	const paymentIntent = await stripe.paymentIntents.create({
		amount,
		currency: 'usd',
		automatic_payment_methods: { enabled: true },
		customer: customerId,
		metadata: { userUid, products: JSON.stringify(products) }
	});

	return paymentIntent;
};

const getUserCart = async (userUid: string) => {
	const { data, error } = await supabaseService
		.from('cart')
		.select('*, product (id, name, price)')
		.eq('user', userUid);

	if (error) throw error;

	return data as Cart[];
};

const getCartTotal = (cart: any[]) => {
	const cartTotal = +cart
		.reduce(
			(total, cartItem) => total + cartItem.quantity * cartItem.product.price,
			0
		)
		.toFixed(2);

	return cartTotal;
};

const getProducts = async (cartItems: Cart[]) => {
	const products = await Promise.all(
		cartItems.map(async (cartItem) => {
			const { data, error } = await supabaseService
				.from('products')
				.select('id, name, price')
				.eq('id', cartItem.product.id)
				.single();

			if (error) throw error;

			return { qty: cartItem.quantity, product: data };
		})
	);

	return products;
};

const getProductsTotal = (
	cartItems: {
		qty: Cart['quantity'];
		product: {
			id: Product['id'];
			name: Product['name'];
			price: Product['price'];
		};
	}[]
) => {
	const cartTotal = +cartItems
		.reduce(
			(total, cartItem) => total + cartItem.product.price * cartItem.qty,
			0
		)
		.toFixed(2);

	return cartTotal;
};

const getCartProducts = (cart: Cart[]) => {
	const cartProducts = cart.map((cartItem) => ({
		id: cartItem.product.id,
		name: cartItem.product.name,
		price: cartItem.product.price,
		quantity: cartItem.quantity,
		variantsSelected: cartItem.variants
	}));

	return cartProducts;
};

const getUserCustomer = async (id: string) => {
	const { data, error } = await supabaseService
		.from('users')
		.select('stripeCustomer')
		.eq('uid', id)
		.single();

	if (error) throw error;

	return data.stripeCustomer;
};

const PaymentIntents = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST')
		return res
			.status(406)
			.json({ message: 'This http method is invalid for this endpoint.' });

	let { useruid: userUid, ordermethod: orderMethod } = req.headers;

	if (userUid === 'false') userUid = undefined;

	if (orderMethod !== 'CART_DB' && orderMethod !== 'CART_LOCAL')
		return res.status(400).json({ message: 'Invalid order method.' });

	if (!userUid && orderMethod === 'CART_DB')
		return res
			.status(401)
			.json({ message: 'Please authenticate before checkout.' });

	let totalAmount: number;

	if (!userUid && orderMethod === 'CART_LOCAL') {
		const userCartReq = req.body as { userCart: Cart[] };

		const userCart = userCartReq.userCart;

		if (userCart.length === 0)
			return res.status(400).json({ message: 'User cart is empty.' });

		totalAmount = getCartTotal(userCart);

		const cartProducts = getCartProducts(userCart);

		const paymentIntent = await createPaymentIntent({
			amount: +(totalAmount * 100).toFixed(2),
			products: cartProducts
		});

		return res.status(201).json({ clientSecret: paymentIntent.client_secret });
	}

	const stripeCustomer = await getUserCustomer(userUid as string);

	const userCart = await getUserCart(userUid as string);

	if (userCart.length === 0)
		return res.status(400).json({ message: 'User cart is empty.' });

	totalAmount = getCartTotal(userCart);

	const cartProducts = getCartProducts(userCart);

	const paymentIntent = await createPaymentIntent({
		amount: +(totalAmount * 100).toFixed(2),
		customerId: stripeCustomer,
		userUid: userUid as string,
		products: cartProducts
	});

	return res.status(201).json({ clientSecret: paymentIntent.client_secret });
};

export default PaymentIntents;
