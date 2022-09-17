import { Product } from '$lib/types/product';
import ProductReviewForm from './ProductReviewForm';

const ProductReviews: React.FC<{ productId: Product['id'] }> = ({
	productId
}) => {
	return (
		<div className="">
			<ProductReviewForm productId={productId} />
		</div>
	);
};

export default ProductReviews;
