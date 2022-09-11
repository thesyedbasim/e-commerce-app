import { useState } from 'react';
import { supabase } from '$lib/supabase';
import { useAppDispatch } from 'app/hooks';
import { addItemToCart } from '$store/cartSlice';

const ProductCta: React.FC<{ product: any }> = ({ product }) => {
	const dispatch = useAppDispatch();

	const [qty, setQty] = useState<number>(1);

	const addToCart = async () => {
		const { data, error: sbError } = await supabase
			.from('cart')
			.insert({ product: product.id, quantity: qty })
			.single();

		if (sbError) {
			console.error('the error while adding item to cart', sbError);

			return;
		}

		dispatch(addItemToCart({ id: data.id, product, quantity: qty }));
	};

	return (
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
	);
};

export default ProductCta;
