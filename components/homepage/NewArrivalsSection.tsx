import { supabase } from '$lib/supabase';
import { useQuery } from '@tanstack/react-query';
import Loader from '@components/misc/Loading';
import SearchProductItem from '@components/search/SearchProductItem';

const fetchNewArrivalsProducts = async () => {
	const { data } = await supabase
		.from('products')
		.select('id, name, seller, price')
		.limit(9);

	return data;
};

const NewArrivalsSection: React.FC = () => {
	const { data: newArrivalsProducts, isFetching } = useQuery(
		['newArrivalsProducts'],
		fetchNewArrivalsProducts
	);

	return (
		<section className="space-y-5">
			<h2 className="text-3xl font-bold">New arrivals</h2>
			<div className="grid grid-cols-4 gap-6">
				{isFetching ? (
					<Loader />
				) : (
					newArrivalsProducts?.map((product) => (
						<SearchProductItem key={product.id} product={product} />
					))
				)}
			</div>
		</section>
	);
};

export default NewArrivalsSection;
