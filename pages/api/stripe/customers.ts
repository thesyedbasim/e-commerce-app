import { NextApiRequest, NextApiResponse } from 'next';
import { getServiceSupabase } from '../../../lib/supabase';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2020-08-27'
});

const Customers = async (req: NextApiRequest, res: NextApiResponse) => {
	console.log('customer endpoint recieved.');

	if (req.method !== 'POST') {
		res.status(405).json({ message: 'This http method is not supported.' });

		return;
	}

	console.log('its post request');

	const dbRecord = req.body.record;

	const userId = dbRecord.id;

	if (!userId) {
		res.status(401).json({ message: 'Please authenticate.' });

		return;
	}

	console.log('user id exists', userId);

	const supabase = getServiceSupabase();

	const { data: user, error: userByIdError } =
		await supabase.auth.api.getUserById(userId as string);

	if (userByIdError) console.error('getting user by id error', userByIdError);

	if (!user) {
		res.status(406).json({ message: 'No profile found for this user.' });

		return;
	}

	console.log('user exists in supabase');

	let customer: Stripe.Response<Stripe.Customer>;

	try {
		customer = await stripe.customers.create({
			email: dbRecord.email
		});

		console.log('customer created');
		console.log(customer);
	} catch (err) {
		console.error('error creating customer', err);

		res
			.status(500)
			.json({ message: 'There was some problem creating a stripe customer' });

		return;
	}

	const { error } = await supabase
		.from('profiles')
		.update({ stripe_customer: customer.id }, { returning: 'minimal' })
		.eq('id', dbRecord.id);

	if (error) {
		console.error('the error for adding stripe id to supabase', error);

		res.status(500).json({
			message: 'There was some error adding stripe customer id to database'
		});

		return;
	}

	res.status(201).json({ message: 'Customer created successfully' });
};

export default Customers;
