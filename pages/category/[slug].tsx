import { GetServerSideProps } from 'next';
import type { NextPage } from 'next';
import { supabase } from '$lib/supabase';
import type { ProductMinimal } from '$lib/types/product';
import ProductItem from '../../components/product/ProductItem';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	const slug = params!.slug;

	const getItemsByCategory = async () => {
		const { data } = await supabase
			.from('products')
			.select('id, name, price, category: categories!inner(slug)')
			.eq('category.slug', slug);

		return data;
	};

	return { props: { products: await getItemsByCategory() } };
};

const Category: NextPage<{ products: ProductMinimal[] }> = ({ products }) => {
	return (
		<>
			<div className="row">
				<div className="col-3"></div>
				<div className="col-9">
					{products.map((product) => (
						<ProductItem key={product.id} product={product} />
					))}
				</div>
			</div>
		</>
	);
};

export default Category;
