import { GetServerSideProps } from 'next';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { supabase } from '$lib/supabase';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
	addReview,
	getAllReviewsOfProduct,
	setReviews
} from '../../store/reviewSlice';
import { useRouter } from 'next/router';
import ProductImagesSection from 'components/product/ProductImagesSection';
import ProductDetailSection from 'components/product/ProductDetailSection';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	const id = params!.id;

	const getProductInfo = async () => {
		const { data } = await supabase
			.from('products')
			.select(`*, seller (*)`)
			.eq('id', id);

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
			<div className="grid grid-cols-[1.75fr_1fr] gap-10">
				<ProductImagesSection product={product} />
				<ProductDetailSection product={product} />
			</div>
		</>
	);
};

export default ProductPage;
