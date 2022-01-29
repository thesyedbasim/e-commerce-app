import { User } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServiceSupabase } from '../../lib/supabase';

const CreateOrder = async (req: NextApiRequest, res: NextApiResponse) => {
	const user = req.headers.userid as User['id'];

	console.log(req.headers);

	const supabaseService = getServiceSupabase();

	if (!user) {
		res.status(401).json({ message: 'You are not authenticated.' });

		return;
	}
};

export default CreateOrder;
