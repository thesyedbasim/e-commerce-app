import Link from 'next/link';
import { supabase } from '$lib/supabase';
import { Cart } from '$lib/types/cart';
import { removeItemFromCart, updateCartItemQuantity } from '$store/cartSlice';
import { useAppDispatch } from 'lib/hooks';
import { debounce } from 'lodash';
import { useCallback } from 'react';
import CrossIcon from '../icons/Cross';
import { UrlObject } from 'url';
import { getFirstProductURL } from '$lib/utils/getProductURLSupabase';

const CartItem: React.FC<{
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
			<div className="grid grid-cols-[1fr_3fr_0.3fr] grid-rows-[min-content_min-content_min-content] gap-y-3 md:grid-rows-1 md:grid-cols-[1fr_5fr_1fr_1fr_0.25fr] gap-x-5 items-center justify-items-start">
				<Link
					href={getProductLink()}
					passHref
					className="row-span-3 md:row-span-1"
				>
					<figure className="bg-gray-100 p-1 md:p-5 aspect-square cursor-pointer">
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
					className="col-start-2 md:col-start-3 col-end-3 md:col-end-4 row-start-3 md:row-start-1 row-end-4 md:row-end-2 border-2 border-gray-300 focus:outline-none hover:border-gray-400 focus:border-gray-400 text-md font-semibold p-4 w-20"
				/>
				<p className="text-md font-bold col-start-2 md:col-start-4 col-end-3 md:col-end-5 row-start-2 md:row-start-1 row-end-3 md:row-end-2">
					${cartItem.product.price}
				</p>
				<CrossIcon
					onClick={() => deleteCartItem(cartItem.id)}
					styles="row-span-3 md:row-span-1"
				/>
			</div>
		</>
	);
};

export default CartItem;
