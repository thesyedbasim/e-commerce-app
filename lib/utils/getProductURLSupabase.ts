import { supabase } from '$lib/supabase';
import { Product } from '$lib/types/product';

export const getProductURL = (productId: Product['id']) => {
	const { data, error } = supabase.storage
		.from('images')
		.getPublicUrl(`products/${productId}`);

	if (error) {
		console.error(error);
		return;
	}

	return data?.publicURL;
};
