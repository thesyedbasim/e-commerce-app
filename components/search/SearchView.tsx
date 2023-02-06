import { useRouter } from 'next/router';
import type { ProductMinimal } from '$lib/types/product';

import ProductSearchItem from '@components/search/SearchProductItem';

const SearchView: React.FC<{ products: ProductMinimal[] }> = ({ products }) => {
	const router = useRouter();

	let arrangedProducts = [...products];

	if (router.query?.sort === 'price-asc') {
		arrangedProducts = products.sort((a, b) => a.price - b.price);
	}

	if (router.query?.sort === 'price-desc') {
		arrangedProducts = products.sort((a, b) => b.price - a.price);
	}

	return (
		<main className="grid grid-cols-3 gap-6">
			{arrangedProducts.map((product) => (
				<ProductSearchItem key={product.id} product={product} />
			))}
		</main>
	);
};

export default SearchView;
