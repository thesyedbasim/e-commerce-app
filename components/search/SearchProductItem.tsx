import Link from 'next/link';
import { getFirstProductURL } from '$lib/utils/getProductURLSupabase';
import type { ProductMinimal } from '$lib/types/product';

const SearchProductItem: React.FC<{
	product: ProductMinimal;
}> = ({ product }) => {
	return (
		<Link href={`/product/${product.id}`} passHref>
			<article className="product-item-search cursor-pointer grid gap-3 items-start">
				<figure className="flex justify-center items-center p-5 bg-gray-100 relative h-56">
					<img
						src={getFirstProductURL(product.id)}
						alt={product.name}
						className="max-w-full max-h-full"
					/>
				</figure>
				<div className="">
					<h3 className="text-lg font-bold">{product.name}</h3>
					<p className="text-md font-bold">${product.price}</p>
				</div>
			</article>
		</Link>
	);
};

export default SearchProductItem;
