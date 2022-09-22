import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getAllOrders, setOrders } from '../../store/orderSlice';
import { supabase } from '$lib/supabase';
import { Order } from '$lib/types/order';
import { dateFormat } from '$lib/utils/dateFormat';
import Link from 'next/link';
import Loader from '@components/misc/Loading';

const OrdersPage: NextPage = () => {
	const user = supabase.auth.user();

	const dispatch = useAppDispatch();

	const orders = useAppSelector(getAllOrders);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');

	useEffect(() => {
		(async () => {
			if (!user) return;

			setIsLoading(true);

			const { data, error: sbError } = await supabase
				.from('orders')
				.select('*')
				.eq('user', user.id);

			if (sbError) {
				console.error('the error while getting orders', sbError);

				setIsLoading(false);
				setError(sbError.message);

				return;
			}

			dispatch(setOrders((data as Order[]) || []));

			setIsLoading(false);
		})();
	}, []);

	if (isLoading) return <Loader />;

	if (error) return <h3>There was some error getting your order details.</h3>;

	if (!isLoading && !error && orders.length === 0)
		return <h3>You do not have any orders.</h3>;

	return (
		<table className="border-2 border-black mx-auto">
			<thead className="bg-black text-white">
				<tr className="">
					<th className="py-3 px-4 text-left">Order #</th>
					<th className="py-3 px-4 text-left">Products</th>
					<th className="py-3 px-4 text-left">Ordered at</th>
					<th className="py-3 px-4 text-left">Total price</th>
					<th className="py-3 px-4 text-left">Status</th>
				</tr>
			</thead>
			<tbody>
				{orders.map((order) => (
					<tr key={order.id}>
						<td className="px-4 py-4">{order.id}</td>
						<td className="px-4 py-4">
							{' '}
							<Link href={`/orders/${order.id}`}>
								{`${order.products[0].name}${
									order.products.length > 1
										? ' and ' + (order.products.length - 1) + ' more'
										: null
								}`}
							</Link>
						</td>
						<td className="px-4 py-4">{dateFormat(new Date(order.paidAt))}</td>
						<td className="px-4 py-4">${order.amount}</td>
						<td className="px-4 py-4">{order.status}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default OrdersPage;
