import Link from 'next/link';
import { getNumOfItemsInCart, getTotalCartPrice } from '$store/cartSlice';
import { useAppSelector } from 'app/hooks';

const CartSummary: React.FC = () => {
	const numOfItemsInCart = useAppSelector(getNumOfItemsInCart);
	const totalCartPrice = useAppSelector(getTotalCartPrice);

	return (
		<div className="card">
			<div className="card-body">
				{numOfItemsInCart > 0 && (
					<>
						<h3 className="text-center">
							<span className="fs-5">Total price:</span> ${totalCartPrice}
						</h3>
						<Link href="/checkout" passHref={true}>
							<button className="btn btn-primary w-100">Checkout</button>
						</Link>
					</>
				)}
			</div>
		</div>
	);
};

export default CartSummary;
