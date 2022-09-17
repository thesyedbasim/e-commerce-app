import { supabase } from '$lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { Category } from '$lib/types/category';
import CategoryItem from './CategoryItem';
import Loader from 'components/misc/Loading';

const CategorySection: React.FC = () => {
	const { data: categories, isFetching } = useQuery(
		['categories'],
		getCategories
	);

	return (
		<section className="space-y-5">
			<h2 className="text-3xl font-bold">Shop by category</h2>
			<div className="grid grid-cols-4 gap-4">
				{isFetching ? (
					<Loader />
				) : (
					(categories as Category[])?.map((category) => (
						<CategoryItem key={category.id} category={category} />
					))
				)}
			</div>
		</section>
	);
};

async function getCategories() {
	const { data, error } = await supabase
		.from('categories')
		.select('id, name, slug, description');

	if (error) {
		console.log(error);
		throw new Error('Cannot fetch categories.');
	}

	return data;
}

export default CategorySection;
