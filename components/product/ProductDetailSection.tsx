import { supabase } from '$lib/supabase';
import { SelectedVariant } from '$lib/types/cart';
import { Product } from '$lib/types/product';
import { addItemToCart } from '$store/cartSlice';
import { useAppDispatch } from 'app/hooks';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ProductVariantsContainer from './ProductVariantsContainer.tsx';

const ProductDetailSection: React.FC<{ product: Product }> = ({ product }) => {
	const router = useRouter();
	const dispatch = useAppDispatch();

	const [qty, setQty] = useState<number>(1);
	const [variants, setVariants] = useState<SelectedVariant[]>([]);

	const addToCart = async () => {
		const { data, error: sbError } = await supabase
			.from('cart')
			.insert({ product: product.id, quantity: qty, variants })
			.single();

		if (sbError) {
			console.error('the error while adding item to cart', sbError);

			return;
		}

		dispatch(addItemToCart({ id: data.id, product, quantity: qty, variants }));
	};

	return (
		<section className="space-y-8">
			<div className="space-y-2">
				<h2 className="text-md font-semibold">{product.seller.name}</h2>
				<h1 className="text-3xl font-bold">{product.name}</h1>
				<h3 className="text-2xl font-bold">${product.price}</h3>
			</div>
			<ProductVariantsContainer product={product} setVariants={setVariants} />
			<div className="">
				<p>{product.description}</p>
			</div>
			<div className="grid grid-cols-[5rem_1fr] gap-4">
				<input
					type="number"
					name="quantity"
					id="quantity"
					value={qty}
					onChange={(e) => {
						setQty(+e.target.value);
					}}
					className="border-2 border-gray-300 focus:outline-none hover:border-gray-400 focus:border-gray-400 text-xl font-semibold p-4"
				/>
				<button
					className="py-4 font-semibold uppercase bg-black hover:bg-gray-800 text-white w-full text-md"
					onClick={addToCart}
				>
					Add to cart
				</button>
			</div>
		</section>
	);
};

export default ProductDetailSection;
