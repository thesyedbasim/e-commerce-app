import { NextApiRequest, NextApiResponse } from 'next';
import { getServiceSupabase } from '$lib/supabase';
import { User } from '$lib/types/user';
import { initStripe } from '$lib/stripe';

const stripe = initStripe();
const supabaseService = getServiceSupabase();

export const createCustomer = async (userProfile: User) => {
	const { uid, name, email } = userProfile;

	const customer = await stripe.customers.create(
		{ name: name || email, email, metadata: { userProfile: uid } },
		{ idempotencyKey: uid }
	);

	return customer;
};

const updateUserCustomer = async (
	uid: User['uid'],
	customerId: User['stripeCustomer']
) => {
	const { error } = await supabaseService
		.from('users')
		.update({ stripeCustomer: customerId }, { returning: 'minimal' })
		.eq('uid', uid);

	if (error) throw error;
};

export const getUser = async (uid: User['uid']) => {
	const { data, error } = await supabaseService
		.from('users')
		.select('*')
		.eq('uid', uid)
		.single();

	if (error) throw error;

	return data as User;
};

// ENDPOINT HANDLER
const Customers = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		res.status(405).json({ message: 'This http method is not supported.' });

		return;
	}

	const { uid: userId } = req.body.record;

	if (!userId) {
		res.status(401).json({ message: 'Please authenticate.' });

		return;
	}

	const user = await getUser(userId);

	if (!user) {
		return res.status(406).json({ message: 'No user found for the user.' });
	}

	let customer;
	try {
		customer = await createCustomer(user);
	} catch (err) {
		return res
			.status(500)
			.json({ message: 'There was some problem creating the stripe customer' });
	}

	try {
		await updateUserCustomer(user.uid, customer.id);
	} catch (err) {
		console.error('the error for adding stripe id to supabase', err);

		return res.status(500).json({
			message: 'There was some error adding stripe customer id to database'
		});
	}

	res.status(201).json({ message: 'Customer created successfully' });
};

export default Customers;
