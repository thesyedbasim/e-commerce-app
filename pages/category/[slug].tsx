import { GetServerSideProps } from 'next';
import type { NextPage } from 'next';
import { supabase } from '../../lib/supabase';
import type { ProductMinimal } from '../../lib/types/product';
import ProductItem from '../../components/product/ProductItem';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	const slug = params!.slug;

	const getItemsByCategory = async () => {
		const { data } = await supabase
			.from('products')
			.select('id, name, price, categories!inner(slug)')
			.eq('categories.slug', slug);

		return data;
	};

	return { props: { products: await getItemsByCategory() } };
};

const Category: NextPage<{ products: ProductMinimal[] }> = ({ products }) => {
	return (
		<>
			{products.map((product) => (
				<ProductItem key={product.id} product={product} />
			))}
			;
		</>
	);
};

export default Category;
