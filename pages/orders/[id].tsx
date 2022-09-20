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
				<h3 className="text-lg font-bold">Order #:</h3>
				<h2 className="text-2xl mb-10">{order.id}</h2>
				<div className="grid grid-cols-[1fr_5fr_1fr_1fr] gap-x-5 items-center justify-items-start border-b-2 border-gray-100 pb-2 mb-8">
					<h2 className="text-md font-bold">Item</h2>
					<h2 className="text-md font-bold"></h2>
					<h2 className="text-md font-bold">Quantity</h2>
					<h2 className="text-md font-bold">Price</h2>
				</div>
				<div className="grid grid-rows-1 gap-y-10">
					{order.products.map((productItem) => (
						<ProductItem key={productItem.id} product={productItem} />
					))}
				</div>
			</>
		);

	return <p>No order with the specified id exists.</p>;
};

export default OrderDetails;
