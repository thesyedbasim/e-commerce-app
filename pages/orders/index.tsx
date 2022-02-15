import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getAllOrders, setOrders } from '../../store/orderSlice';
import { supabase } from '$lib/supabase';
import { Order } from '$lib/types/order';
import { dateFormat } from '$lib/utils/dateFormat';
import Link from 'next/link';
import Loader from 'components/misc/Loading';

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
		<table className="table">
			<thead>
				<tr>
					<td>Order #</td>
					<td>Products</td>
					<td>Ordered at</td>
					<td>Total price</td>
					<td>Status</td>
				</tr>
			</thead>
			<tbody>
				{orders.map((order) => (
					<tr key={order.id}>
						<td>{order.id}</td>
						<td>
							{' '}
							<Link href={`/orders/${order.id}`}>
								{order.products
									.slice(0, 2)
									.map((productItem: any) => `${productItem.name}`)
									.join(', ')}
							</Link>
						</td>
						<td>{dateFormat(new Date(order.paidAt))}</td>
						<td>${order.amount}</td>
						<td>{order.status}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default OrdersPage;
