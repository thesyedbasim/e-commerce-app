import ReviewItem from 'components/review/ReviewItem';
import ReviewForm from 'components/review/ReviewForm';
import { supabase } from '$lib/supabase';
import { Review } from '$lib/types/review';

const ProductReviews: React.FC<{
	reviews: Review[];
	createReview: Function;
}> = ({ reviews, createReview }) => {
	const user = supabase.auth.user();

	return (
		<>
			<div className="mt-3 reviews">
				<p className="fw-bold">Reviews</p>
				{reviews.length > 0 ? (
					reviews.map((review) => (
						<ReviewItem key={review.id} review={review} />
					))
				) : (
					<p>There are no reviews for this product.</p>
				)}
			</div>
			{user && <ReviewForm createReview={createReview} />}
		</>
	);
};

export default ProductReviews;
