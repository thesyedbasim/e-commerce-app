import { useState } from 'react';

const ReviewForm: React.FC<{ createReview: Function }> = ({ createReview }) => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [rating, setRating] = useState(5);

	const handleSubmit = async () => {
		if (
			title.length > 0 &&
			description.length > 0 &&
			rating > 0 &&
			rating <= 5
		) {
			createReview({ title, description, rating });

			setTitle('');
			setDescription('');
			setRating(5);
		}
	};

	return (
		<div className="mt-3 add-review">
			<p className="fw-bold">Add a review</p>
			<form className="form mb-5">
				<div className="form-group">
					<button
						className="btn btn-outline-warning"
						onClick={(e) => {
							e.preventDefault();
							setRating(1);
						}}
					>
						*
					</button>
					<button
						className="btn btn-outline-warning"
						onClick={(e) => {
							e.preventDefault();
							setRating(2);
						}}
					>
						*
					</button>
					<button
						className="btn btn-outline-warning"
						onClick={(e) => {
							e.preventDefault();
							setRating(3);
						}}
					>
						*
					</button>
					<button
						className="btn btn-outline-warning"
						onClick={(e) => {
							e.preventDefault();
							setRating(4);
						}}
					>
						*
					</button>
					<button
						className="btn btn-outline-warning"
						onClick={(e) => {
							e.preventDefault();
							setRating(5);
						}}
					>
						*
					</button>
				</div>
				<div className="form-group">
					<label htmlFor="title">Enter a title</label>
					<input
						type="text"
						className="form-control"
						id="title"
						onChange={(e) => {
							setTitle(e.target.value);
						}}
						value={title}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="description">Enter a description</label>
					<textarea
						className="form-control"
						id="description"
						rows={8}
						onChange={(e) => {
							setDescription(e.target.value);
						}}
						value={description}
					></textarea>
				</div>
				<button
					className="btn btn-primary"
					onClick={(e) => {
						e.preventDefault();
						handleSubmit();
					}}
				>
					Submit review
				</button>
			</form>
		</div>
	);
};

export default ReviewForm;
