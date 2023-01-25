import { NextApiRequest, NextApiResponse } from 'next';

import { initStripe } from '$lib/stripe';
import { getServiceSupabase } from '$lib/supabase';
import type { Cart } from '$lib/types/cart';

const stripe = initStripe();
const supabaseService = getServiceSupabase();

const createPaymentIntent = async ({
	amount,
	customerId,
	userUid = null
}: {
	amount: number;
	customerId?: string;
	userUid?: string | null;
}) => {
	const paymentIntent = await stripe.paymentIntents.create({
		amount,
		currency: 'usd',
		automatic_payment_methods: { enabled: true },
		customer: customerId,
		metadata: { userUid }
	});

	return paymentIntent;
};

const fetchUserCart = async (userUid: string) => {
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

const getUserStripeCustomerId = async (userUid: string) => {
	const { data, error } = await supabaseService
		.from('users')
		.select('stripeCustomer')
		.eq('uid', userUid)
		.single();

	if (error) throw error;

	return (data.stripeCustomer as string) || undefined;
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

	const SHIPPING_COST = 5;
	const SHIPPING_TRESHOLD_AMOUNT = 50;

	const getIsShippingCostRequired = (subtotalAmount: number) =>
		subtotalAmount < SHIPPING_TRESHOLD_AMOUNT;

	const getShippingAmount = (isShippingCostRequired: boolean) => {
		return isShippingCostRequired ? SHIPPING_COST : 0;
	};

	const getTotalAmount = (subtotalAmount: number, shippingAmount: number) => {
		return subtotalAmount + shippingAmount;
	};

	let stripeCustomer: string | undefined;
	if (userUid)
		stripeCustomer = await getUserStripeCustomerId(userUid as string);

	const userCart = userUid
		? await fetchUserCart(userUid as string)
		: (req.body.userCart as Cart[]);

	if (userCart.length === 0)
		return res.status(400).json({ message: 'User cart is empty.' });

	const subtotalAmount = +getCartTotal(userCart).toFixed(2);

	const shippingAmount = getShippingAmount(
		getIsShippingCostRequired(subtotalAmount)
	);
	const totalAmount = +getTotalAmount(subtotalAmount, shippingAmount).toFixed(
		2
	);

	const paymentIntent = await createPaymentIntent({
		amount: subtotalAmount * 100,
		customerId: stripeCustomer,
		userUid: userUid as string
	});

	return res.status(201).json({
		clientSecret: paymentIntent.client_secret,
		payment: {
			subtotal: subtotalAmount,
			shipping: shippingAmount,
			total: totalAmount
		}
	});
};

export default PaymentIntents;
