import { Product } from '$lib/types/product';

const ProductDetail: React.FC<{ product: Product }> = ({ product }) => {
	return (
		<>
			<h1>{product.name}</h1>
			<div className="price d-flex">
				<p>Price:</p>
				<h3>${product.price}</h3>
			</div>
			<div className="mt-3 description">
				<p className="fw-bold">Description</p>
				<p>{product.description}</p>
			</div>
		</>
	);
};

export default ProductDetail;
