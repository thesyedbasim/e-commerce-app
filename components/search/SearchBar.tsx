import { useRouter } from 'next/router';
import { useState } from 'react';

const SearchBar: React.FC = () => {
	const router = useRouter();

	const [searchQuery, setSearchQuery] = useState('');

	return (
		<div className="justify-self-stretch grid grid-cols-[0.75fr] justify-center">
			<form
				className=""
				onSubmit={(e) => {
					e.preventDefault();
					router.push({ pathname: '/search', query: { q: searchQuery } });
				}}
			>
				<input
					type="text"
					placeholder="Search"
					className="w-full border rounded-none border-gray-400 placeholder:text-gray-400 bg-black px-4 py-2 hover:border-gray-200 focus:outline-none focus:border-gray-200
					"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</form>
		</div>
	);
};
export default SearchBar;
