import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '$lib/supabase';
import { useAppDispatch } from '../../app/hooks';
import { setSearchItems } from '$store/searchSlice';
import { ProductMinimal } from '$lib/typesproduct';

const Search: React.FC = () => {
	const router = useRouter();

	const dispatch = useAppDispatch();

	const [search, setSearch] = useState<string>('');

	const searchForQuery = async () => {
		const { data } = await supabase
			.from('products')
			.select('id, name, price')
			.textSearch('name', `'${search}'`);

		dispatch(setSearchItems((data as ProductMinimal[]) || []));

		router.push('/search');
	};

	return (
		<form
			className="d-flex"
			onSubmit={(e) => {
				e.preventDefault();
				searchForQuery();
			}}
		>
			<input
				className="form-control me-2"
				type="search"
				placeholder="Search"
				aria-label="Search"
				onChange={(e) => setSearch(e.target.value)}
				value={search}
			/>
			<button
				className="btn btn-outline-success"
				disabled={!search.trim()}
				type="submit"
			>
				Search
			</button>
		</form>
	);
};
export default Search;
