import Link from 'next/link';
import { supabase } from '$lib/supabase';
import { Cart } from '$lib/types/cart';
import { removeItemFromCart, updateCartItemQuantity } from '$store/cartSlice';
import { useAppDispatch } from 'app/hooks';
import { debounce } from 'lodash';
import { useCallback } from 'react';
import CrossIcon from './icons/CrossIcon';
import { UrlObject } from 'url';
import { getFirstProductURL } from '$lib/utils/getProductURLSupabase';

const CartItem: React.FC<{
	cartItem: Cart;
	setIsLoading: Function;
	setError: Function;
}> = ({ cartItem, setIsLoading, setError }) => {
	const user = supabase.auth.user();

	const dispatch = useAppDispatch();

	const updateQuantityDB = async (
		itemId: Cart['id'],
		qty: Cart['quantity']
	) => {
		const user = supabase.auth.user();

		if (!user) return;

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

	const updateQuantity = (itemId: Cart['id'], qty: Cart['quantity']) => {
		updateQuantityHandler(itemId, qty);

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

	const getProductLink: () => UrlObject = () => {
		let variantsQuery: { [key: string]: string } = {};

		cartItem.variants?.forEach((variant) => {
			variantsQuery[variant.name] = variant.option.name;
		});

		return {
			pathname: `/product/${cartItem.product.id}`,
			query: variantsQuery
		};
	};

	return (
		<>
			<div className="grid grid-cols-[1fr_5fr_1fr_1fr_0.25fr] gap-x-5 items-center justify-items-start">
				<Link href={getProductLink()} passHref>
					<figure className="bg-gray-100 p-5 aspect-square cursor-pointer">
						<img src={getFirstProductURL(cartItem.product.id)} />
					</figure>
				</Link>
				<Link href={getProductLink()} passHref>
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
						if (+e.target.value <= 0) return;

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
