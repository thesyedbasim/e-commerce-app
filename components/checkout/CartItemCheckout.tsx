import Link from 'next/link';
import { supabase } from '$lib/supabase';
import { Cart } from '$lib/types/cart';
import { removeItemFromCart, updateCartItemQuantity } from '$store/cartSlice';
import { useAppDispatch } from 'app/hooks';
import { debounce } from 'lodash';
import { useCallback } from 'react';
import CrossIcon from '../icons/Cross';
import { UrlObject } from 'url';
import { getFirstProductURL } from '$lib/utils/getProductURLSupabase';

const CartItemCheckout: React.FC<{
	cartItem: Cart;
	setIsLoading: Function;
	setError: Function;
}> = ({ cartItem, setIsLoading, setError }) => {
	const user = supabase.auth.user();

	const dispatch = useAppDispatch();

	const updateQuantityLocal = (itemId: Cart['id'], qty: Cart['quantity']) => {
		const cartItems = JSON.parse(
			localStorage.getItem('cart') || JSON.stringify([])
		) as Cart[];

		cartItems[cartItems.findIndex((cartItem) => cartItem.id === itemId)] = {
			...cartItem,
			quantity: qty
		};

		localStorage.setItem('cart', JSON.stringify(cartItems));
	};

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
		if (!user) updateQuantityLocal(itemId, qty);
		else updateQuantityHandler(itemId, qty);

		dispatch(updateCartItemQuantity({ itemId, qty }));
	};

	const deleteCartItemLocal = (cartItemId: Cart['id']) => {
		let cartItems = JSON.parse(
			localStorage.getItem('cart') || JSON.stringify([])
		) as Cart[];

		cartItems = cartItems.filter((cartItem) => cartItem.id !== cartItemId);

		localStorage.setItem('cart', JSON.stringify(cartItems));
	};

	const deleteCartItem = async (cartItemId: number) => {
		if (!user) deleteCartItemLocal(cartItemId);
		else {
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
			<div className="mt-6 grid grid-cols-[1fr_4fr_2fr] gap-x-5 items-center justify-items-start">
				<figure className="flex justify-center items-center bg-white aspect-square relative">
					<img
						className="box-border max-w-full"
						src={getFirstProductURL(cartItem.product.id)}
					/>
					<div className="absolute top-[-5px] right-[-5px] text-center flex justify-center items-center bg-white text-black p-1 w-5 h-5 text-xs font-bold border-gray-300 border-2 rounded-full">
						{cartItem.quantity}
					</div>
				</figure>
				<div className="">
					<h3 className="text-sm">{cartItem.product.name}</h3>
					<div className="flex gap-3">
						<p>
							{cartItem.variants
								?.map((variant) => `${variant.name}: ${variant.option.name}`)
								.join(' | ')}
						</p>
					</div>
				</div>
				<p className="text-md font-bold justify-self-end">
					${cartItem.product.price}
				</p>
			</div>
		</>
	);
};

export default CartItemCheckout;
