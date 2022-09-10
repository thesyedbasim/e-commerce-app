import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { supabase } from '$lib/supabase';
import { Category } from '$lib/types/category';

export const getServerSideProps: GetServerSideProps = async () => {
	const getCategoryData = async () => {
		const { data, error } = await supabase
			.from('categories')
			.select('id, name, slug, description');

		if (error) {
			console.log(error);
			throw new Error('there was some problem getting data');
		}

		return data;
	};

	const data = await getCategoryData();

	if (!data)
		return {
			notFound: true
		};

	return {
		props: {
			categories: data
		}
	};
};

const Home: NextPage<{ categories: Category[] }> = ({ categories }) => {
	return (
		<>
			<div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
				{categories.map((category) => (
					<div className="col" key={category.id}>
						<div className="card">
							<div className="card-body">
								<h5 className="card-title fw-bold">{category.name}</h5>
								<p className="card-text">{category.description}</p>
								<Link href={`/category/${category.slug}`}>
									<a className="btn btn-primary">View category</a>
								</Link>
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export default Home;
