import { supabase } from '$lib/supabase';
import { addOrder, getOrderById } from '$store/orderSlice';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import Loader from 'components/misc/Loading';
import ProductItem from 'components/product/ProductItem';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const OrderDetails: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;

	const user = supabase.auth.user();

	const dispatch = useAppDispatch();

	const order = useAppSelector(getOrderById(id as string));

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');

	useEffect(() => {
		if (!id) return;

		(async () => {
			setIsLoading(true);

			const { data, error: sbError } = await supabase
				.from('orders')
				.select('*')
				.eq('user', user?.id)
				.eq('id', id)
				.single();

			if (sbError) {
				console.error('error while getting order details', sbError);

				setIsLoading(false);
				setError(sbError.message);

				return;
			}

			dispatch(addOrder(data));

			setIsLoading(false);
		})();
	}, [id]);

	if (isLoading) return <Loader />;

	if (!isLoading && order)
		return (
			<>
				<h1>Order #: {order.id}</h1>
				{order.products?.map((productItem) => (
					<ProductItem key={productItem.id} product={productItem} />
				))}
			</>
		);

	return <h1>No order with the specified id exists.</h1>;
};

export default OrderDetails;
