import Link from 'next/link';
import type { Category } from '$lib/types/category';

const CategoryItem: React.FC<{ category: Category }> = ({ category }) => {
	return (
		<Link href={`/search/category/${category.slug}`} passHref={true}>
			<div className="p-4 border-2 border-gray-200 rounded-md cursor-pointer">
				<div className="card-body">
					<h5 className="card-title font-bold">{category.name}</h5>
				</div>
			</div>
		</Link>
	);
};

export default CategoryItem;
