import { useEffect } from 'react';
import type { NextPage } from 'next';
import { useDispatch } from 'react-redux';
import { supabase } from '$lib/supabase';
import { setCartItems } from '$store/cartSlice';

const CheckoutSuccessPage: NextPage = () => {
	const user = supabase.auth.user();

	const dispatch = useDispatch();

	useEffect(() => {
		(async () => {
			if (!user) {
				localStorage.removeItem('cart');

				dispatch(setCartItems([]));

				return;
			} else {
				const { error } = await supabase
					.from('cart')
					.delete({ returning: 'minimal' })
					.eq('user_id', user.id);

				if (error) return;

				dispatch(setCartItems([]));
			}
		})();
	}, []);

	return <p>Thank you for purchasing. Your checkout was successful.</p>;
};

export default CheckoutSuccessPage;
