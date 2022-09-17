import type { NextPage } from 'next';
import { Category } from '$lib/types/category';
import CategorySection from 'components/homepage-comps/categories/CategorySection';
import NewArrivalsSection from 'components/homepage-comps/products-suggestions/NewArrivalsSection';

const Home: NextPage<{ categories: Category[] }> = ({ categories }) => {
	return (
		<>
			<div className="flex flex-col gap-y-12">
				<CategorySection />
				<NewArrivalsSection />
			</div>
		</>
	);
};

export default Home;
