import { supabase } from '$lib/supabase';
import { addOrder, getOrderById } from '$store/orderSlice';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import ProductItem from 'components/product/ProductItem';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const OrderDetails: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;

	const user = supabase.auth.user();

	const dispatch = useAppDispatch();

	const order = useAppSelector(getOrderById(id as string));

	useEffect(() => {
		if (!id) return;

		(async () => {
			const { data, error } = await supabase
				.from('orders')
				.select('*')
				.eq('user', user?.id)
				.eq('id', id)
				.single();

			if (error) {
				console.error('error while getting order details', error);

				return;
			}

			dispatch(addOrder(data));
		})();
	}, [id]);

	if (!order) return <h1>No order with the specified id exists.</h1>;

	return (
		<>
			<h1>Order #: {order.id}</h1>
			{order.products?.map((productItem) => (
				<ProductItem key={productItem.id} product={productItem} />
			))}
		</>
	);
};

export default OrderDetails;
