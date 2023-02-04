import { GetStaticPaths, GetStaticProps } from 'next';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { supabase } from '$lib/supabase';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import {
	addReview,
	getAllReviewsOfProduct,
	setReviews
} from '../../store/reviewSlice';
import { useRouter } from 'next/router';
import ProductImages from '@components/product/ProductImages';
import ProductDetails from '@components/product/ProductDetails';

export const getStaticPaths: GetStaticPaths = async () => {
	const getAllProductPaths = async () => {
		const { data } = await supabase.from('products').select(`*, seller (*)`);

		return data?.map((product) => ({ params: { id: product.id } })) || [];
	};

	const paths = await getAllProductPaths();

	return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const id = params!.id;

	const getProductInfo = async () => {
		const { data } = await supabase.rpc('get_product_from_id', { id });

		return data;
	};

	const productInfo = await getProductInfo();

	return {
		props: {
			product: productInfo ? productInfo[0] : null
		}
	};
};

const ProductPage: NextPage<{ product: any }> = ({ product }) => {
	const router = useRouter();

	const { id } = router.query;

	const [user, setUser] = useState(supabase.auth.user());

	const dispatch = useAppDispatch();

	const reviews = useAppSelector(getAllReviewsOfProduct(product.id));

	const fetchAndSetProductReviews = async () => {
		const { data, error } = await supabase
			.from('reviews')
			.select(`*`)
			.eq('product', id);

		if (error) {
			console.error(error);
		}

		dispatch(setReviews(data || []));
	};

	useEffect(() => {
		fetchAndSetProductReviews();
	}, []);

	const createReview = async ({
		title,
		description,
		rating
	}: {
		title: string;
		description: string;
		rating: number;
	}) => {
		if (!user) {
			return;
		}

		const { data: userInfo } = await supabase
			.from('users')
			.select('name')
			.eq('uid', user.id)
			.single();

		const { data } = await supabase
			.from('reviews')
			.insert({
				title,
				description,
				rating,
				product: product.id,
				author: { id: user.id, name: userInfo.name }
			})
			.single();

		dispatch(addReview(data));
	};

	if (!product) return <h1>No product with the specified id exists.</h1>;

	return (
		<>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
				<ProductImages product={product} />
				<ProductDetails product={product} />
			</div>
		</>
	);
};

export default ProductPage;
