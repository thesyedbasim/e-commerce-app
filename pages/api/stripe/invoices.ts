import type { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '$lib/stripe';
import { getServiceSupabase } from '$lib/supabase';
import { User } from '$types/user';
import Stripe from 'stripe';

const supabaseService = getServiceSupabase();

const createInvoiceItem = async ({
	customerId,
	amount,
	productId
}: {
	customerId: string;
	amount: number;
	productId: number;
}) => {
	await stripe.invoiceItems.create({
		customer: customerId,
		amount: amount * 100,
		currency: 'usd',
		metadata: { productId }
	});
};

const createInvoice = async ({
	customerId,
	userUid,
	orderId
}: {
	customerId: string;
	userUid: User['uid'];
	orderId: number;
}) => {
	const invoice = await stripe.invoices.create(
		{
			auto_advance: false,
			customer: customerId,
			metadata: { userUid },
			custom_fields: [{ name: 'orderId', value: `${orderId}` }],
			expand: ['payment_intent']
		},
		{ idempotencyKey: `${orderId}` }
	);

	return invoice;
};

const getUserCustomer = async (uid: User['uid']) => {
	const { data, error } = await supabaseService
		.from('users')
		.select('stripeCustomer')
		.eq('uid', uid)
		.single();

	if (error) throw error;

	return data as User;
};

const getFinalizedInvoice = async (invoiceId: string) => {
	const invoice = await stripe.invoices.finalizeInvoice(invoiceId);

	return invoice;
};

const payInvoice = async (invoiceId: string) => {
	const invoice = await stripe.invoices.pay(invoiceId, {
		expand: ['payment_intent']
	});

	return invoice;
};

// const getInvoice = async (invoiceId: string) => {
// 	const invoice = await stripe.invoices.retrieve(invoiceId);

// 	return invoice;
// };

const getOrderInvoiceId = async (orderId: number) => {
	const { data, error } = await supabaseService
		.from('orders')
		.select('stripeInvoice')
		.eq('id', orderId)
		.single();

	if (error) throw error;

	return data.stripeInvoice;
};

const setOrderStatus = async (orderId: number, status: string) => {
	const { error } = await supabaseService
		.from('orders')
		.update({ status: 'TRACKED' }, { returning: 'minimal' })
		.eq('id', orderId)
		.eq('status', 'PAYMENT_PENDING');

	if (error) throw error;
};

const setOrderStripeInvoice = async (orderId: number, invoiceId: string) => {
	const { error } = await supabaseService
		.from('orders')
		.update({ stripeInvoice: invoiceId }, { returning: 'minimal' })
		.eq('id', orderId)
		.eq('stripeInvoice', null);

	if (error) throw error;
};

export const payInvoiceAndOrder = async (
	orderId: number,
	invoiceId: string
) => {
	try {
		const paidInvoice = await payInvoice(invoiceId);

		if (paidInvoice.paid) {
			await setOrderStatus(+orderId, 'TRACKED');
		}
	} catch (err) {
		console.error(err);
	}
};

const Invoices = async (req: NextApiRequest, res: NextApiResponse) => {
	console.log('req body', req.body);

	if (req.method === 'POST') {
		const {
			id: orderId,
			userId: userUid,
			orderAmount,
			products
		} = req.body.record;

		const { stripeCustomer } = await getUserCustomer(userUid);

		if (!stripeCustomer)
			return res.status(400).json({ message: 'Missing stripe customer.' });

		const allProducts = (products as any[]).map(async (product) => {
			console.log('product', product);

			await createInvoiceItem({
				customerId: stripeCustomer,
				amount: orderAmount,
				productId: product.id
			});
		});

		Promise.all(allProducts);

		let invoice: Stripe.Response<Stripe.Invoice>;

		invoice = await createInvoice({
			customerId: stripeCustomer,
			orderId,
			userUid
		});

		invoice = await getFinalizedInvoice(invoice.id);

		console.log('the invocie object');
		console.log(invoice);

		await setOrderStripeInvoice(orderId, invoice.id);

		return res.status(200).json({ message: 'Invoice successfully created.' });
	}

	if (req.method === 'GET') {
		const { orderId } = req.query;

		if (orderId)
			return res.status(400).json({ message: 'Please specify order ID.' });

		const stripeInvoiceId = await getOrderInvoiceId(+orderId);
	}
};

export default Invoices;
