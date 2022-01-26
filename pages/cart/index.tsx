import type { GetServerSideProps, NextPage } from 'next';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
	getAllCartItems,
	getTotalCartPrice,
	removeItemFromCart
} from '../../app/store/cartSlice';

//export const getServerSideProps: GetServerSideProps = async () => {

//return {}
//}

const Cart: NextPage = () => {
	const dispatch = useAppDispatch();

	const cartItems = useAppSelector(getAllCartItems);
	const totalCartPrice = useAppSelector(getTotalCartPrice);

	return (
		<>
			<h3>Total price: ${totalCartPrice}</h3>
			{cartItems.map((cartItem) => (
				<div
					key={cartItem.id || Date.toString()}
					className="card mb-3"
					style={{ maxWidth: '540px' }}
				>
					<div className="row g-0">
						<div className="col-md-4">
							<img src="..." className="img-fluid rounded-start" alt="..." />
						</div>
						<div className="col-md-8">
							<div className="card-body">
								<a href={`/product/${cartItem.product.id}`}>
									<h5 className="card-title">{cartItem.product.name}</h5>
								</a>
								<p className="card-text">{cartItem.product.price}</p>
								<p className="card-text">quantity: {cartItem.quantity}</p>
								<button
									className="btn btn-danger"
									onClick={() =>
										dispatch(removeItemFromCart({ cartItemId: cartItem.id! }))
									}
								>
									Remove from cart
								</button>
							</div>
						</div>
					</div>
				</div>
			))}
		</>
	);
};

export default Cart;
