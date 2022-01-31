import type { NextPage } from 'next';
import { useAppSelector } from '../app/hooks';
import { getAllSearchItems } from '../store/searchSlice';
import ProductItem from '../components/product/ProductItem';

const SearchPage: NextPage = () => {
	const searchItems = useAppSelector(getAllSearchItems);

	return (
		<>
			{searchItems && searchItems.length > 0 ? (
				searchItems.map((searchItem) => (
					<ProductItem key={searchItem.id} product={searchItem} />
				))
			) : (
				<h1>No items found.</h1>
			)}
		</>
	);
};

export default SearchPage;
