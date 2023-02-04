import { useRouter } from 'next/router';
import { getAllCartItems, getTotalCartPrice } from '$store/cartSlice';

import { useAppDispatch, useAppSelector } from 'lib/hooks';
import Link from 'next/link';

import CartItem from './CartItem';
import Button from '@components/ui/Button';

const CartView: React.FC<{
	setIsLoading: Function;
	setError: Function;
}> = ({ setIsLoading, setError }) => {
	const router = useRouter();

	const cartItems = useAppSelector(getAllCartItems);
	const totalCartPrice = useAppSelector(getTotalCartPrice);

	return (
		<section className="">
			<h1 className="text-3xl font-bold mb-8">My Cart</h1>
			<div className="hidden md:grid grid-cols-[1fr_5fr_1fr_1fr_0.25fr] gap-x-5 items-center justify-items-start border-b-2 border-gray-100 pb-2 mb-8">
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
			<div className="grid grid-cols-1 lg:grid-cols-[6fr_3fr] mt-10 lg:mt-0">
				<div className="hidden lg:block"></div>
				<div className="pt-5 border-t-2 border-gray-100 space-y-5">
					<div className="grid grid-cols-2">
						<p className="font-bold">Subtotal</p>
						<p className="justify-self-end font-bold">${totalCartPrice}</p>
					</div>
					<Button
						text="Checkout"
						functions={{ onClick: () => router.push('/checkout') }}
					/>
				</div>
			</div>
		</section>
	);
};

export default CartView;
