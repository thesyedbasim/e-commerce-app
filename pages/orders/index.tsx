import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getAllOrders, setOrders } from '../../store/orderSlice';
import { supabase } from '$lib/supabase';
import { Order } from '$lib/types/order';
import Link from 'next/link';

const OrdersPage: NextPage = () => {
	const user = supabase.auth.user();

	const dispatch = useAppDispatch();

	const orders = useAppSelector(getAllOrders);

	const [error, setError] = useState<string>('');

	useEffect(() => {
		(async () => {
			if (!user) return;

			const { data, error: sbError } = await supabase
				.from('orders')
				.select('*')
				.eq('user', user.id);

			console.log('user orders', data);

			if (sbError) {
				console.error('the error while getting orders', sbError);

				setError(sbError.message);

				return;
			}

			dispatch(setOrders((data as Order[]) || []));
		})();
	}, []);

	return (
		<main>
			{error && <h3>There was some error getting your order details.</h3>}
			{!error && orders.length === 0 && <h3>There are no orders.</h3>}
			{!error && orders.length > 0 && (
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
											.map((productItem: any) => `${productItem.name}`)
											.join(', ')}
									</Link>
								</td>
								<td>{order.paidAt}</td>
								<td>{order.amount}</td>
								<td>{order.status}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</main>
	);
};

export default OrdersPage;
