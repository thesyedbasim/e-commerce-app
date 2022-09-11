import { supabase } from '$lib/supabase';
import { Cart, CartDB } from '$lib/types/cart';
import { ProductMinimal } from '$lib/types/product';
import { removeItemFromCart, updateCartItemQuantity } from '$store/cartSlice';
import { useAppDispatch } from 'app/hooks';
import { debounce } from 'lodash';
import { useCallback } from 'react';

const CartItem: React.FC<{
	cartItem: Cart;
	setIsLoading: Function;
	setError: Function;
}> = ({ cartItem, setIsLoading, setError }) => {
	const user = supabase.auth.user();

	const dispatch = useAppDispatch();

	const getProductURL = (id: ProductMinimal['id']) => {
		const { data, error } = supabase.storage
			.from('images')
			.getPublicUrl(`products/${id}`);

		if (error) {
			console.error(error);
			return;
		}

		return data?.publicURL;
	};

	const updateQuantityDB = async (
		itemId: Cart['id'],
		qty: Cart['quantity']
	) => {
		const user = supabase.auth.user();

		if (!user) return;

		console.log(user.id);

		const { error: sbError } = await supabase
			.from<CartDB>('cart')
			.update({ quantity: qty })
			.eq('id', itemId)
			.eq('user', user.id);

		if (sbError) {
			console.error(sbError);

			setIsLoading(false);
			setError(sbError.message);

			return;
		}
	};

	const updateQuantityHandler = useCallback(
		debounce(
			async (itemId: Cart['id'], qty: Cart['quantity']) =>
				await updateQuantityDB(itemId, qty),
			1000
		),
		[]
	);

	const updateQuantity = async (itemId: Cart['id'], qty: Cart['quantity']) => {
		await updateQuantityHandler(itemId, qty);

		dispatch(updateCartItemQuantity({ itemId, qty }));
	};

	const deleteCartItem = async (cartItemId: number) => {
		if (!user) return;

		const { error: sbError } = await supabase
			.from('cart')
			.delete({ returning: 'minimal' })
			.eq('id', cartItemId)
			.eq('user', user.id);

		if (sbError) {
			console.error(
				'There was some problem removing that item from cart.',
				sbError
			);

			return;
		}

		dispatch(removeItemFromCart({ cartItemId }));
	};

	return (
		<tr key={cartItem.id}>
			<td className="col-3">
				<img
					src={getProductURL(cartItem.product.id)}
					alt={cartItem.product.name}
					className="img-thumbnail"
				/>
			</td>
			<td>
				<h4>{cartItem.product.name}</h4>
				<div className="quantity col-2">
					<label>Quantity:</label>
					<input
						type="number"
						className="form-control"
						value={cartItem.quantity}
						onChange={(e) => {
							if (+e.target.value < 0) return;

							updateQuantity(cartItem.id, +e.target.value);
						}}
					/>
				</div>
				<div
					className="btn btn-danger mt-3"
					onClick={() => deleteCartItem(cartItem.id)}
				>
					Remove
				</div>
			</td>
			<td className="fs-4 text-end fw-bold">${cartItem.product.price}</td>
		</tr>
	);
};

export default CartItem;
