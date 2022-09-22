import type { NextPage } from 'next';
import Categories from '@components/homepage/categories/Categories';
import NewArrivalsSection from '@components/homepage/NewArrivalsSection';

const Home: NextPage = () => {
	return (
		<>
			<div className="flex flex-col gap-y-12">
				<Categories />
				<NewArrivalsSection />
			</div>
		</>
	);
};

export default Home;
