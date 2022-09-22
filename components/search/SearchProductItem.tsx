import { ProductMinimal } from '$lib/types/product';
import { getFirstProductURL } from '$lib/utils/getProductURLSupabase';
import Link from 'next/link';

const SearchProductItem: React.FC<{ product: ProductMinimal }> = ({
	product
}) => {
	return (
		<Link href={`/product/${product.id}`} passHref>
			<article className="product-item-search cursor-pointer">
				<figure className="aspect-square flex justify-center items-center p-8 bg-gray-100 mb-3">
					<img src={getFirstProductURL(product.id)} alt={product.name} />
				</figure>
				<h4 className="text-sm">{product.seller.name}</h4>
				<h3 className="text-lg font-bold">{product.name}</h3>
				<p className="text-md font-bold">${product.price}</p>
			</article>
		</Link>
	);
};

export default SearchProductItem;
