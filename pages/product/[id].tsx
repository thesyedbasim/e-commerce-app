import { GetServerSideProps } from 'next';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
//import { Product } from '$lib/typesproduct';
import { supabase } from '$lib/supabase';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addItemToCart } from '../../store/cartSlice';
import {
	addReview,
	getAllReviewsOfProduct,
	setReviews
} from '../../store/reviewSlice';
import { useRouter } from 'next/router';
import ReviewItem from 'components/review/ReviewItem';
import { Review } from '$lib/types/review';
import ReviewForm from 'components/review/ReviewForm';
import ProductCta from 'components/product/ProductCta';
import ProductDetail from 'components/product/ProductDetail';
import ProductReviews from 'components/product/ProductReviews';
import ProductImages from 'components/product/ProductImages';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	const id = params!.id;

	const getProductInfo = async () => {
		const { data } = await supabase.from('products').select('*').eq('id', id);

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
			.select(
				`
				*,
				author
			`
			)
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
			<div className="row">
				<div className="col-4">
					<ProductImages product={product} />
				</div>
				<div className="col-6">
					<ProductDetail product={product} />
					<ProductReviews reviews={reviews} createReview={createReview} />
				</div>
				<div className="col-2">
					<ProductCta product={product} />
				</div>
			</div>
		</>
	);
};

export default ProductPage;
