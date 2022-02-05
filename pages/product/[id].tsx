import { GetServerSideProps } from 'next';
import type { NextPage } from 'next';
import { useState } from 'react';
//import { Product } from '$lib/typesproduct';
import { supabase } from '$lib/supabase';
import { useAppDispatch } from '../../app/hooks';
import { addItemToCart } from '../../store/cartSlice';
import { useRouter } from 'next/router';

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

		console.log(data);

		return data?.publicURL;
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
