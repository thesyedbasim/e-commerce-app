import Link from 'next/link';
import { ProductMinimal } from '$lib/types/product';
import { supabase } from '$lib/supabase';

const ProductItem: React.FC<{ product: ProductMinimal }> = ({ product }) => {
	const getProductURL = () => {
		const { data, error } = supabase.storage
			.from('images/products')
			.getPublicUrl(`${product.id}`);

		if (error) {
			console.error(error);
			return;
		}

		return data?.publicURL;
	};

	return (
		<div className="card mb-3" style={{ maxWidth: '540px' }}>
			<div className="row g-0">
				<div className="col-md-4">
					<img
						src={getProductURL()}
						className="img-fluid rounded-start"
						alt={product.name}
					/>
				</div>
				<div className="col-md-8">
					<div className="card-body">
						<h5 className="card-title">{product.name}</h5>
						<h4>${product.price}</h4>
						<br />
						<Link href={`/product/${product.id}`}>
							<a>Item details</a>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductItem;
