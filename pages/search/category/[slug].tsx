import { GetServerSideProps } from 'next';
import type { NextPage } from 'next';
import { supabase } from '$lib/supabase';
import type { ProductMinimal } from '$lib/types/product';
import ProductSearchItemsContainer from 'components/search/ProductSearchItemsContainer';
import SearchFiltersSidebar from 'components/search/SearchFiltersSidebar';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	const slug = params!.slug;

	const getItemsByCategory = async () => {
		const { data } = await supabase
			.from('products')
			.select(
				'id, name, price, seller (id, name), category: categories!inner(slug)'
			)
			.eq('category.slug', slug);

		return data;
	};

	return { props: { products: await getItemsByCategory() } };
};

const Category: NextPage<{ products: ProductMinimal[] }> = ({ products }) => {
	return (
		<>
			<div className="grid grid-cols-[1fr_3fr]">
				<SearchFiltersSidebar />
				<ProductSearchItemsContainer products={products} />
			</div>
		</>
	);
};

export default Category;
