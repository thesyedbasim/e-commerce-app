import { supabase } from '$lib/supabase';
import { Review } from '$lib/types/review';
import classNames from 'classnames';
import { useAppDispatch } from 'app/hooks';
import { removeReview } from '$store/reviewSlice';

const ReviewItem: React.FC<{ review: Review }> = ({ review }) => {
	const dispatch = useAppDispatch();

	const user = supabase.auth.user();

	const canUserDeleteReview = () => {
		if (!user) return false;

		return user.id === review.author.id;
	};

	const deleteReview = async () => {
		await supabase.from('reviews').delete().eq('id', review.id);

		dispatch(removeReview(review.id));
	};

	return (
		<div className="card mb-3">
			<div className="card-header d-flex justify-content-between align-items-baseline">
				{!review.author.name || review.author.name === 'N/A'
					? 'Anonymous'
					: review.author.name}{' '}
				<button
					className={classNames(
						'btn',
						'btn-danger',
						canUserDeleteReview() ? 'visible' : 'invisible'
					)}
					onClick={deleteReview}
				>
					Delete
				</button>
			</div>
			<div className="card-body">
				<h5 className="card-title">{review.title}</h5>
				<h6 className="card-subtitle mb-2 text-muted">{review.rating} stars</h6>
				<p className="card-text">{review.description}</p>
			</div>
		</div>
	);
};

export default ReviewItem;
