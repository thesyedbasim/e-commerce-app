import { Product } from '$lib/types/product';
import { getProductURL } from '$lib/utils/getProductURLSupabase';

const ProductImagesSection: React.FC<{ product: Product }> = ({ product }) => {
	return (
		<section className="grid grid-cols-[6rem_1fr] gap-3">
			<aside className="space-y-3">
				<figure className="aspect-square bg-gray-100 flex justify-center items-center p-3">
					<img src={getProductURL(product.id)} />
				</figure>
				<figure className="aspect-square bg-gray-100 flex justify-center items-center p-3">
					<img src={getProductURL(product.id)} />
				</figure>
				<figure className="aspect-square bg-gray-100 flex justify-center items-center p-3">
					<img src={getProductURL(product.id)} />
				</figure>
			</aside>
			<figure className="aspect-square bg-gray-100 flex justify-center items-center p-5">
				<img src={getProductURL(product.id)} alt={product.name} />
			</figure>
		</section>
	);
};

export default ProductImagesSection;
