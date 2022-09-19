import { Product } from '$lib/types/product';
import {
	getAllProductsURL,
	getFirstProductURL
} from '$lib/utils/getProductURLSupabase';
import { useQuery } from '@tanstack/react-query';

const ProductImagesSection: React.FC<{ product: Product }> = ({ product }) => {
	const { data: productsURLs } = useQuery(
		['productsURLs'],
		async () => await getAllProductsURL(product.id)
	);

	return (
		<section className="grid grid-cols-[6rem_1fr] gap-3">
			<aside className="space-y-3">
				{productsURLs?.map((productURL) => (
					<figure
						key={productURL as string}
						className="aspect-square bg-gray-100 flex justify-center items-center p-3"
					>
						<img src={productURL as string} />
					</figure>
				))}
			</aside>
			<figure className="aspect-square bg-gray-100 flex justify-center items-center p-5">
				<img src={getFirstProductURL(product.id)} alt={product.name} />
			</figure>
		</section>
	);
};

export default ProductImagesSection;
