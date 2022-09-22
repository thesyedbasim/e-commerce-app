import { getAllCartItems, getTotalCartPrice } from '$store/cartSlice';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import Link from 'next/link';
import CartItem from './CartItem';

const CartView: React.FC<{
	setIsLoading: Function;
	setError: Function;
}> = ({ setIsLoading, setError }) => {
	const dispatch = useAppDispatch();

	const cartItems = useAppSelector(getAllCartItems);
	const totalCartPrice = useAppSelector(getTotalCartPrice);

	return (
		<section className="">
			<h1 className="text-3xl font-bold mb-8">My Cart</h1>
			<div className="grid grid-cols-[1fr_5fr_1fr_1fr_0.25fr] gap-x-5 items-center justify-items-start border-b-2 border-gray-100 pb-2 mb-8">
				<h2 className="text-md font-bold">Item</h2>
				<h2 className="text-md font-bold"></h2>
				<h2 className="text-md font-bold">Quantity</h2>
				<h2 className="text-md font-bold">Price</h2>
			</div>
			<div className="grid grid-rows-1 gap-y-10">
				{cartItems.map((cartItem) => (
					<CartItem
						key={cartItem.id}
						cartItem={cartItem}
						setIsLoading={setIsLoading}
						setError={setError}
					/>
				))}
			</div>
			<div className="grid grid-cols-[6fr_3fr]">
				<div className=""></div>
				<div className="pt-5 border-t-2 border-gray-100 space-y-5">
					<div className="grid grid-cols-2">
						<p className="font-bold">Subtotal</p>
						<p className="justify-self-end font-bold">${totalCartPrice}</p>
					</div>
					<Link href="/checkout" passHref>
						<button className="py-4 font-semibold uppercase bg-black hover:bg-gray-800 text-white w-full text-md">
							Checkout
						</button>
					</Link>
				</div>
			</div>
		</section>
	);
};

export default CartView;