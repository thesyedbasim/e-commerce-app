import { supabase } from '$lib/supabase';
import ProductItem from 'components/product/ProductItem';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const OrderDetails: NextPage = () => {
	const router = useRouter();

	const { id } = router.query;

	const user = supabase.auth.user();

	const [products, setProducts] = useState<any[]>();

	useEffect(() => {
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

			setProducts(data.products);
		})();
	}, [id]);

	return (
		<>
			{products?.map((productItem) => (
				<ProductItem key={productItem.id} product={productItem} />
			))}
		</>
	);
};

export default OrderDetails;
