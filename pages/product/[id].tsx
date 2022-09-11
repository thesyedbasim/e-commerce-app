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

	const [qty, setQty] = useState<number>(1);

	const [error, setError] = useState<string>('');

	const dispatch = useAppDispatch();

	const reviews = useAppSelector(getAllReviewsOfProduct(product.id));

	const addToCart = async () => {
		const { data, error: sbError } = await supabase
			.from('cart')
			.insert({ product: product.id, quantity: qty })
			.single();

		if (sbError) {
			setError(sbError.message);
			console.error('the error while adding item to cart', sbError);

			return;
		}

		dispatch(addItemToCart({ id: data.id, product, quantity: qty }));
	};

	const getPictureURL = () => {
		const { data, error } = supabase.storage
			.from('images')
			.getPublicUrl(`products/${id}`);

		if (error) {
			console.error(error);
			return;
		}

		return data?.publicURL;
	};

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
		const user = supabase.auth.user();

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
					<img src={getPictureURL()} alt={product.name} className="img-fluid" />
				</div>
				<div className="col-6">
					<h1>{product.name}</h1>
					<div className="price d-flex">
						<p>Price:</p>
						<h3>${product.price}</h3>
					</div>
					<div className="mt-3 description">
						<p className="fw-bold">Description</p>
						<p>{product.description}</p>
					</div>
					<div className="mt-3 reviews">
						<p className="fw-bold">Reviews</p>
						{reviews.length > 0 ? (
							reviews.map((review) => (
								<ReviewItem key={review.id} review={review} />
							))
						) : (
							<p>There are no reviews for this product.</p>
						)}
					</div>
					<ReviewForm createReview={createReview} />
				</div>
				<div className="col-2">
					<div className="card">
						<div className="card-body">
							<label htmlFor="qty">Quantity:</label>
							<input
								type="number"
								id="qty"
								className="form-control"
								onChange={(e) => setQty(+e.target.value)}
								value={qty}
							/>

							<button
								className="btn btn-primary mt-3"
								onClick={addToCart}
								disabled={qty < 1}
							>
								Add to cart
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ProductPage;
