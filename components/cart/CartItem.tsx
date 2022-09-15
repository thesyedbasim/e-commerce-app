import Link from 'next/link';
import { supabase } from '$lib/supabase';
import { Cart } from '$lib/types/cart';
import { Product } from '$lib/types/product';
import { removeItemFromCart, updateCartItemQuantity } from '$store/cartSlice';
import { useAppDispatch } from 'app/hooks';
import { debounce } from 'lodash';
import { useCallback } from 'react';
import CrossIcon from './icons/CrossIcon';

const CartItem: React.FC<{
	cartItem: Cart;
	setIsLoading: Function;
	setError: Function;
}> = ({ cartItem, setIsLoading, setError }) => {
	const user = supabase.auth.user();

	const dispatch = useAppDispatch();

	const getProductURL = (id: Product['id']) => {
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
			.from('cart')
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
		<>
			<div
				key={cartItem.id}
				className="grid grid-cols-[1fr_5fr_1fr_1fr_0.25fr] gap-x-5 items-center justify-items-start"
			>
				<Link href={`/product/${cartItem.product.id}`} passHref>
					<figure className="bg-gray-100 p-5 aspect-square cursor-pointer">
						<img src={getProductURL(cartItem.product.id)} />
					</figure>
				</Link>
				<Link href={`/product/${cartItem.product.id}`} passHref>
					<div className="cursor-pointer">
						<h3 className="text-md font-bold">{cartItem.product.name}</h3>
						<div className="flex gap-3">
							<p>
								{cartItem.variants
									?.map((variant) => `${variant.name}: ${variant.option.name}`)
									.join(' | ')}
							</p>
						</div>
					</div>
				</Link>
				<input
					type="number"
					name="quantity"
					id="quantity"
					value={cartItem.quantity}
					onChange={(e) => {
						if (+e.target.value < 0) return;

						updateQuantity(cartItem.id, +e.target.value);
					}}
					className="border-2 border-gray-300 focus:outline-none hover:border-gray-400 focus:border-gray-400 text-md font-semibold p-4 w-20"
				/>
				<p className="text-md font-bold">${cartItem.product.price}</p>
				<CrossIcon onClick={() => deleteCartItem(cartItem.id)} />
			</div>
		</>
	);
};

export default CartItem;