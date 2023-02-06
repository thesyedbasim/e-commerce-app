import Link from 'next/link';
import { useAppDispatch } from '$lib/hooks';
import { getFirstProductURL } from '$lib/utils/getProductURLSupabase';
import type { ProductMinimal } from '$lib/types/product';
import type { Wishlist } from '$lib/types/wishlist';

import ProductWishlistButton from '@components/product/ProductWishlistButton';

const WishlistItem: React.FC<{
	product: ProductMinimal;
	wishlistItem: Wishlist;
}> = ({ product, wishlistItem }) => {
	const dispatch = useAppDispatch();

	return (
		<article className="product-item-search">
			<figure className="aspect-square flex justify-center items-center p-8 bg-gray-100 mb-3 relative">
				<img src={getFirstProductURL(product.id)} alt={product.name} />
				<div>
					<ProductWishlistButton
						productId={product.id}
						position="bottom-right"
					/>
				</div>
			</figure>
			<Link href={`/product/${product.id}`} passHref>
				<div className="cursor-pointer">
					<h4 className="text-sm">{product.seller.name}</h4>
					<h3 className="text-lg font-bold">{product.name}</h3>
					<p className="text-md font-bold">${product.price}</p>
				</div>
			</Link>
		</article>
	);
};

export default WishlistItem;
