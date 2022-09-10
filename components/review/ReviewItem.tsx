import { Review } from '$lib/types/review';

const ReviewItem: React.FC<{ review: Review }> = ({ review }) => {
	return (
		<div className="card mb-3">
			<div className="card-header d-flex justify-content-between align-items-baseline">
				{!review.author.name || review.author.name === 'N/A'
					? 'Anonymous'
					: review.author.name}{' '}
				<button className="btn btn-danger invisible">Delete</button>
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
