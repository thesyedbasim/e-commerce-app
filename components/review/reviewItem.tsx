import { Review } from '$lib/types/review';

const ReviewItem: React.FC<{ review: Review }> = ({
	review: { id, createdAt, title, description, rating, author }
}) => {
	return (
		<div>
			<p>le title: {title}</p>
			<p>le description: {description}</p>
		</div>
	);
};

export default ReviewItem;
