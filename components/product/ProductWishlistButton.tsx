import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';
import { supabase } from '$lib/supabase';
import { useAppDispatch } from '$lib/hooks';
import type { Product } from '$lib/types/product';
import type { Wishlist } from '$lib/types/wishlist';
import { addWishlistItem, removeWishlistItem } from '$store/wishlistSlice';

import WishlistIcon from '@icons/Wishlist';

const fetchIsProductInWishlist = async (productId: Product['id']) => {
	const user = supabase.auth.user();

	if (!user) return false;

	const { data, error } = await supabase
		.from('wishlist')
		.select('*', { count: 'exact' })
		.eq('product', productId)
		.eq('user', user.id);

	if (error) throw error;

	return (data || []).length > 0 ? true : false;
};

const ProductWishlistButton: React.FC<{
	productId: Product['id'];
	fetchIsInWishlist?: boolean;
	position?: 'bottom-right';
}> = ({ productId, fetchIsInWishlist = false, position }) => {
	const queryClient = useQueryClient();

	const { data = false } = useQuery(
		['wishlistItem'],
		fetchIsInWishlist
			? async () => fetchIsProductInWishlist(productId)
			: () => true,
		{ initialData: false, refetchOnMount: true }
	);

	const dispatch = useAppDispatch();

	const [isProductInWishlist, setIsProductInWishlist] = useState(data);

	useEffect(() => {
		setIsProductInWishlist(data);
	}, [data]);

	// cancel fetching data on unmount
	useEffect(() => {
		return () => {
			queryClient.cancelQueries(['wishlist', 'item']);
		};
	});

	const addToWishlistMutation = useMutation(async () => {
		setIsProductInWishlist(true);

		const user = supabase.auth.user();
		if (!user) return;

		const { data, error } = await supabase
			.from('wishlist')
			.insert({ product: productId, user: user.id })
			.single();

		if (error) {
			throw error;
		}

		dispatch(addWishlistItem(data as Wishlist));
	});

	const deleteFromWishlistMutation = useMutation(async () => {
		setIsProductInWishlist(false);

		dispatch(removeWishlistItem({ productId }));

		const user = supabase.auth.user();
		if (!user) return;

		const { error } = await supabase
			.from('wishlist')
			.delete()
			.eq('product', productId)
			.eq('user', user.id);

		if (error) {
			throw error;
		}
	});

	return (
		<button
			onClick={() => {
				isProductInWishlist
					? deleteFromWishlistMutation.mutate()
					: addToWishlistMutation.mutate();
			}}
			className={classNames(
				'flex',
				'justify-center',
				'items-center',
				'border-none',
				'bg-gray-100',
				'focus:outline-none',
				position === 'bottom-right'
					? ['absolute', 'bottom-5', 'right-5']
					: false
			)}
		>
			<WishlistIcon
				size="w-6"
				variant={isProductInWishlist ? 'fill' : 'outline'}
				fillStyle={isProductInWishlist ? 'text-red-400' : undefined}
			/>
		</button>
	);
};

export default ProductWishlistButton;
