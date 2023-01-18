import { useEffect } from 'react';
import type { NextPage } from 'next';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '$lib/supabase';
import { useAppDispatch, useAppSelector } from 'app/hooks';

import { getWishlist, setWishlist } from '$store/wishlistSlice';
import type { Wishlist } from '$lib/types/wishlist';

import Loader from '@components/misc/Loading';
import WishlistItem from '@components/wishlist/WishlistItem';

const fetchUserWishlist = async () => {
	const user = supabase.auth.user();

	if (!user) return;

	const { data, error } = await supabase
		.from<Wishlist>('wishlist')
		.select('*, product (id, name, seller (id, name), price)')
		.eq('user', user.id);

	if (error) throw error;

	return data || [];
};

const Wishlist: NextPage = () => {
	const dispatch = useAppDispatch();

	const {
		data = [],
		isLoading,
		isError
	} = useQuery(['wishlist'], fetchUserWishlist, {
		refetchOnMount: true
	});

	useEffect(() => {
		dispatch(setWishlist(data));
	}, [data]);

	const wishlist = useAppSelector(getWishlist);

	if (isLoading) return <Loader />;

	if (!isLoading && isError)
		return <p>There was a problem fetching your wishlist.</p>;

	if (!isLoading && !isError && wishlist.length === 0)
		return <p>There are no items in your wishlist</p>;

	return (
		<main>
			<div className="grid grid-cols-3 gap-5">
				{wishlist?.map((wishlistItem) => (
					<WishlistItem
						key={wishlistItem.id}
						wishlistItem={wishlistItem}
						product={wishlistItem.product}
					/>
				))}
			</div>
		</main>
	);
};

export default Wishlist;
