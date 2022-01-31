import { User } from '$types/user';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServiceSupabase } from '$lib/supabase';

const supabaseService = getServiceSupabase();

export const getUser = async (uid: User['uid']) => {
	const { data, error } = await supabaseService
		.from('users')
		.select('*')
		.eq('uid', uid)
		.single();

	if (error) throw error;

	return data as User;
};

const getUserCart = async (userUid: User['uid']) => {
	const { data, error } = await supabaseService
		.from('cart')
		.select('quantity, product: product_id (id, price)')
		.eq('userUid', userUid);

	if (error) throw error;

	return data;
};

const getCartTotal = async (cart: any[]) => {
	const cartTotal = cart.reduce(
		(total, cartItem) => total + cartItem.product.price * cartItem.quantity,
		0
	);

	return cartTotal;
};

interface OrderProduct {
	id: number;
	quantity: number;
	price: number;
}

const createOrder = async ({
	amount,
	products,
	userUid
}: {
	amount: number;
	products: OrderProduct[];
	userUid: User['uid'];
}) => {
	const { data, error } = await supabaseService
		.from('orders')
		.insert({ amount, products, userUid })
		.single();

	if (error) throw error;

	return data;
};

const Orders = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST')
		return res
			.status(405)
			.json({ message: 'This endpoint does not support this http method.' });

	const userUid = req.headers.useruid as User['uid'];

	if (!userUid)
		return res.status(401).json({ message: 'You are not authenticated.' });

	try {
		const user = await getUser(userUid);

		if (!user) {
			return res
				.status(406)
				.json({ message: 'User not found with the uid specified.' });
		}
	} catch (err) {
		return res.status(400).json({ message: 'Invalid user uid.' });
	}

	const userCart = await getUserCart(userUid);
	const totalCartPrice = await getCartTotal(userCart);

	const orderObjArr = userCart.map((cartItem) => ({
		id: cartItem.product.id,
		quantity: cartItem.quantity,
		price: cartItem.product.price
	}));

	await createOrder({
		amount: totalCartPrice,
		products: orderObjArr as OrderProduct[],
		userUid
	});

	res.status(201).json({ message: 'Order successfully created.' });
};

export default Orders;
