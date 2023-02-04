import SearchProductItem from '@components/search/SearchProductItem';
import { ProductMinimal } from '$lib/types/product';

const NewArrivalsSection: React.FC<{ products: ProductMinimal[] }> = ({
	products
}) => {
	return (
		<section className="space-y-5">
			<h2 className="text-3xl font-bold">New arrivals</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
				{products?.map((product) => (
					<SearchProductItem key={product.id} product={product} />
				))}
			</div>
		</section>
	);
};

export default NewArrivalsSection;
