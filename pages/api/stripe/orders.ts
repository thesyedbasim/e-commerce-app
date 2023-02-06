import { getServiceSupabase } from '$lib/supabase';
import type { User } from '$lib/types/user';

const supabaseService = getServiceSupabase();

export const createOrder = async ({
	amount,
	products,
	userUid
}: {
	amount: number;
	products: any[];
	userUid: User['uid'];
}) => {
	const { data, error } = await supabaseService
		.from('orders')
		.insert({ amount, products, user: userUid })
		.single();

	if (error) console.error(error);
	if (error) throw error;

	return data;
};
