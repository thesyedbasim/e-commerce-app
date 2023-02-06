import type { GetServerSideProps, NextPage } from 'next';
import { supabase } from '$lib/supabase';
import type { ProductMinimal } from '$lib/types/product';

import SearchView from '@components/search/SearchView';
import SearchSidebar from '@components/search/SearchSidebar';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const searchQuery = query.q;

	const searchForQuery = async () => {
		if (!searchQuery) return;

		const { data } = await supabase
			.from('products')
			.select('id, name, seller, price')
			.textSearch('name', `'${searchQuery}'`);

		return data || [];
	};

	const searchResults = await searchForQuery();

	return { props: { searchResults, searchQuery } };
};

const SearchPage: NextPage<{
	searchResults: ProductMinimal[];
	searchQuery: string;
}> = ({ searchResults, searchQuery }) => {
	return (
		<>
			<div className="grid grid-cols-[1fr_3fr]">
				<SearchSidebar />
				<div className="">
					{searchResults.length === 0 ? (
						<h2 className="text-lg">
							There are no products that match{' '}
							<span className="font-bold">&ldquo;{searchQuery}&rdquo;</span>
						</h2>
					) : (
						<>
							<h2 className="text-lg mb-10">
								Results for{' '}
								<span className="font-bold">&ldquo;{searchQuery}&rdquo;</span>
							</h2>
							<SearchView products={searchResults} />
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default SearchPage;
