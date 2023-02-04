import { Category } from '$lib/types/category';
import CategoryItem from './CategoryItem';

const Categories: React.FC<{ categories: Category[] }> = ({ categories }) => {
	return (
		<section className="space-y-5">
			<h2 className="text-3xl font-bold">Shop by category</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
				{categories.map((category) => (
					<CategoryItem key={category.id} category={category} />
				))}
			</div>
		</section>
	);
};

export default Categories;
