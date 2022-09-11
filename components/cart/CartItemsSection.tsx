import { getAllCartItems } from '$store/cartSlice';
import { useAppSelector } from 'app/hooks';
import CartItem from './CartItem';

const CartItemsSection: React.FC<{
	setIsLoading: Function;
	setError: Function;
}> = ({ setIsLoading, setError }) => {
	const cartItems = useAppSelector(getAllCartItems);

	return (
		<table className="table">
			<thead>
				<tr>
					<th></th>
					<th></th>
					<th className="text-end">Price</th>
				</tr>
			</thead>
			<tbody>
				{cartItems.map((cartItem) => (
					<CartItem
						key={cartItem.id}
						setIsLoading={setIsLoading}
						setError={setError}
						cartItem={cartItem}
					/>
				))}
			</tbody>
		</table>
	);
};

export default CartItemsSection;
