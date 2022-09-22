import { supabase } from '$lib/supabase';
import { Product } from '$lib/types/product';
import { addReview } from '$store/reviewSlice';
import { useAppDispatch } from 'app/hooks';
import { useState } from 'react';

const ProductReviews: React.FC<{ productId: Product['id'] }> = ({
	productId
}) => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [rating, setRating] = useState(5);

	const dispatch = useAppDispatch();

	const createReview = async () => {
		const user = supabase.auth.user();

		if (!user) return;

		const { data: userInfo } = await supabase
			.from('users')
			.select('uid, name')
			.eq('uid', user.id)
			.single();

		const { data: review } = await supabase
			.from('reviews')
			.insert({
				title,
				description,
				rating,
				product: productId,
				author: { id: userInfo.uid, name: userInfo.name }
			})
			.single();

		dispatch(addReview(review));
	};

	const handleSubmit = async () => {
		if (
			title.length <= 0 ||
			description.length <= 0 ||
			rating <= 0 ||
			rating > 5
		)
			return;

		await createReview();

		setTitle('');
		setDescription('');
		setRating(5);
	};
	return (
		<div className="">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
				className="flex flex-col gap-y-4"
			>
				<div className="">
					{[1, 2, 3, 4, 5].map((el) => (
						<button
							key={el}
							onClick={() => {
								setRating(el);
							}}
							className={rating >= el ? 'text-yellow-500' : ''}
						>
							{el}
						</button>
					))}
				</div>
				<input
					type="text"
					name="product-review-title"
					className="border-2 border-gray-300 focus:outline-none hover:border-gray-400 focus:border-gray-400 text-md font-semibold px-4 py-2"
					placeholder="Product title"
					value={title}
					onChange={(e) => {
						setTitle(e.target.value);
					}}
				/>
				<textarea
					name="product-review-description"
					cols={30}
					rows={10}
					className="border-2 border-gray-300 focus:outline-none hover:border-gray-400 focus:border-gray-400 text-md px-4 py-2"
					placeholder="Enter product description here..."
					value={description}
					onChange={(e) => {
						setDescription(e.target.value);
					}}
				></textarea>
				<input
					type="submit"
					value="Submit review"
					className="cursor-pointer py-4 font-semibold uppercase bg-black hover:bg-gray-800 text-white w-full text-md resize-none"
				/>
			</form>
		</div>
	);
};

export default ProductReviews;
