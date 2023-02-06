import type { GetStaticProps, NextPage } from 'next';
import { supabase } from '$lib/supabase';
import type { ProductMinimal } from '$lib/types/product';
import type { Category } from '$lib/types/category';

import Categories from '@components/homepage/categories/Categories';
import NewArrivalsSection from '@components/homepage/NewArrivalsSection';

export const getStaticProps: GetStaticProps = async () => {
	const getCategories = async () => {
		const { data } = await supabase.from('categories').select(`*`);

		return data || [];
	};

	const getProducts = async () => {
		const { data } = await supabase
			.from('products')
			.select(`id, name, price, seller(*)`)
			.limit(10);

		return data || [];
	};

	const categories = await getCategories();
	const products = await getProducts();

	return {
		props: {
			categories,
			products
		}
	};
};

const Home: NextPage<{
	categories: Category[];
	products: ProductMinimal[];
}> = ({ categories, products }) => {
	return (
		<>
			<div className="flex flex-col gap-y-12">
				<Categories categories={categories} />
				<NewArrivalsSection products={products} />
			</div>
		</>
	);
};

export default Home;
