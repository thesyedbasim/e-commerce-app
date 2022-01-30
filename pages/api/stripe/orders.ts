import { User } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServiceSupabase } from '../../../lib/supabase';

const CreateOrder = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		res
			.status(405)
			.json({ message: 'This endpoint does not support this http method.' });

		return;
	}

	const userId = req.headers.userid as User['id'];

	const supabaseService = getServiceSupabase();

	if (!userId) {
		res.status(401).json({ message: 'You are not authenticated.' });

		return;
	}

	const { data: user } = await supabaseService.auth.api.getUserById(userId);

	if (!user) {
		res
			.status(406)
			.json({ message: 'User with the specified id does not exist.' });

		return;
	}

	await supabaseService.from('orders').insert({ order });
};

export default CreateOrder;
