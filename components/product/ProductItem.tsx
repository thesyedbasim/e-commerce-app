import Link from 'next/link';
import { getFirstProductURL } from '$lib/utils/getProductURLSupabase';
import { Order } from '$lib/types/order';

const ProductItem: React.FC<{ product: Order['products'][0] }> = ({
	product
}) => {
	return (
		<div className="grid grid-cols-[1fr_5fr_1fr_1fr] gap-x-5 items-center justify-items-start">
			<Link href={'/'} passHref>
				<figure className="bg-gray-100 p-5 aspect-square cursor-pointer">
					<img src={getFirstProductURL(product.id)} />
				</figure>
			</Link>
			<Link href={'/'} passHref>
				<div className="cursor-pointer">
					<h3 className="text-md font-bold">{product.name}</h3>
					<div className="flex gap-3">
						<p>
							{product.variantsSelected
								?.map((variant) => `${variant.name}: ${variant.option.name}`)
								.join(' | ')}
						</p>
					</div>
				</div>
			</Link>
			<p
				id="quantity"
				className="border-2 border-gray-300 text-md font-semibold p-4 w-20"
			>
				{product.quantity}
			</p>
			<p className="text-md font-bold">${product.price}</p>
		</div>
	);
};

export default ProductItem;
