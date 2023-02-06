import { supabase } from '$lib/supabase';
import type { Product } from '$lib/types/product';

export function getFirstProductURL(productId: Product['id']) {
	const { data, error } = supabase.storage
		.from('images')
		.getPublicUrl(`products/${productId}/${productId}`);

	if (error) {
		console.error(error);
		return;
	}

	return data?.publicURL;
}

export function getProductURL(productFileName: string) {
	const { data } = supabase.storage
		.from('images')
		.getPublicUrl(`products/${productFileName}`);

	return data;
}

export async function getAllProductsURL(productId: Product['id']) {
	const { data, error } = await supabase.storage
		.from('images')
		.list(`products/${productId}`);

	if (error) {
		console.error(error);
	}

	const productImagesFileNames =
		data?.map(
			(productImageFileName) =>
				getProductURL(productImageFileName.name)!.publicURL
		) || [];

	return productImagesFileNames;
}
