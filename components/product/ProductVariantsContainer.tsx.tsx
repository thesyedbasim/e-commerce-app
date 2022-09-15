import { SelectedVariant } from '$lib/types/cart';
import { Product } from '$lib/types/product';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';
import ProductVariantItem from './ProductVariantItem';

const ProductVariantsContainer: React.FC<{
	product: Product;
	setVariants: Dispatch<SetStateAction<SelectedVariant[]>>;
}> = ({ product, setVariants }) => {
	const router = useRouter();

	const variantUpdateHandler = (
		variant: Product['variants'][0],
		option: Product['variants'][0]['options'][0]
	) => {
		router.push(
			{
				query: {
					...router.query,
					[variant.name]: option.name
				}
			},
			undefined,
			{ scroll: false, shallow: true }
		);

		setVariants((prevVariants) => [
			...prevVariants,
			{
				name: variant.name,
				option: { name: option.name, meta: option.meta }
			}
		]);
	};

	return (
		<div className="space-y-8">
			{product.variants.map((variant) => (
				<ProductVariantItem
					key={variant.name}
					variant={variant}
					variantUpdateHandler={variantUpdateHandler}
				/>
			))}
		</div>
	);
};

export default ProductVariantsContainer;
