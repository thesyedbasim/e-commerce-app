import { supabase } from '$lib/supabase';
import { Cart, SelectedVariant } from '$lib/types/cart';
import { Product } from '$lib/types/product';
import { addItemToCart } from '$store/cartSlice';
import { useAppDispatch } from 'lib/hooks';
import { useState } from 'react';
import ProductReviews from './ProductReviews';
import ProductVariants from './ProductVariants';
import ProductWishlistButton from './ProductWishlistButton';
import Button from '@components/ui/Button';

const ProductDetails: React.FC<{ product: Product }> = ({ product }) => {
	const dispatch = useAppDispatch();

	const [qty, setQty] = useState<number>(1);
	const [variants, setVariants] = useState<SelectedVariant[]>([]);

	const user = supabase.auth.user();

	const addToCart = async () => {
		if (!user) {
			// get cart last item id, then next item's id increments by 1
			const localStorageCartItems = JSON.parse(
				localStorage.getItem('cart') || JSON.stringify([])
			) as Cart[];
			const prevItemId =
				localStorageCartItems[localStorageCartItems.length - 1]?.id || 0;

			localStorage.setItem(
				'cart',
				JSON.stringify([
					...localStorageCartItems,
					{ id: prevItemId + 1, product, quantity: qty, variants }
				])
			);

			dispatch(
				addItemToCart({ id: prevItemId + 1, product, quantity: qty, variants })
			);

			return;
		}

		console.log('user logged in');

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
				<h1 className="text-3xl font-bold">{product.name}</h1>
				<h3 className="text-2xl font-bold">${product.price}</h3>
			</div>
			{product.variants && (
				<ProductVariants product={product} setVariants={setVariants} />
			)}
			<div className="">
				<p>{product.description}</p>
			</div>
			<div className="grid grid-cols-[5rem_4rem_1fr] gap-4">
				<input
					type="number"
					name="quantity"
					id="quantity"
					value={qty}
					onChange={(e) => {
						if (+e.target.value <= 0) return;

						setQty(+e.target.value);
					}}
					className="border-2 border-gray-300 focus:outline-none hover:border-gray-400 focus:border-gray-400 text-xl font-semibold p-4"
				/>
				<ProductWishlistButton productId={product.id} fetchIsInWishlist />
				<Button text="Add to cart" functions={{ onClick: addToCart }} />
			</div>
			<details className="p-6 border-y-2 cursor-pointer transition-all">
				<summary className="list-none relative after:content-[''] after:inline-block after:border-r-4 after:border-b-4 after:p-1 after:border-black after:rotate-45 after:absolute after:top-1/2 after:-translate-y-1/2 after:right-0 after:transition-all">
					<h3 className="text-2xl">Reviews</h3>
				</summary>
				<div className="mt-6">
					<ProductReviews productId={product.id} />
				</div>
			</details>
		</section>
	);
};

export default ProductDetails;
