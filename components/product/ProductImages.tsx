import { Product } from '$lib/types/product';
import { supabase } from '$lib/supabase';

const ProductImages: React.FC<{ product: Product }> = ({ product }) => {
	const getPictureURL = () => {
		const { data, error } = supabase.storage
			.from('images')
			.getPublicUrl(`products/${product.id}`);

		if (error) {
			console.error(error);
			return;
		}

		return data?.publicURL;
	};

	return <img src={getPictureURL()} alt={product.name} className="img-fluid" />;
};

export default ProductImages;
