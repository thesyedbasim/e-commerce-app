import type { NextPage } from 'next';
import Link from 'next/link';
import { Category } from '$lib/types/category';
import CategorySection from 'components/homepage-comps/categories/CategorySection';

const Home: NextPage<{ categories: Category[] }> = ({ categories }) => {
	return (
		<>
			<CategorySection />
			<section className="my-8">
				<h2 className="text-3xl font-bold">New arrivals</h2>
				<div className="grid grid-cols-3 gap-4 mt-4">
					<div className="">
						<img src="/book.jpg" />
						<div className="">
							<h3 className="text-xl font-bold">Book</h3>
							<h4 className="text-2xl">$ 34.99</h4>
						</div>
					</div>
					<div className="">
						<img src="/book.jpg" />
						<div className="">
							<h3 className="text-xl font-bold">Book</h3>
							<h4 className="text-2xl">$ 34.99</h4>
						</div>
					</div>
					<div className="">
						<img src="/book.jpg" />
						<div className="">
							<h3 className="text-xl font-bold">Book</h3>
							<h4 className="text-2xl">$ 34.99</h4>
						</div>
					</div>
					<div className="">
						<img src="/book.jpg" />
						<div className="">
							<h3 className="text-xl font-bold">Book</h3>
							<h4 className="text-2xl">$ 34.99</h4>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default Home;
