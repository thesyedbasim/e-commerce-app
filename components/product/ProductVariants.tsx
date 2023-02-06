import { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router';
import type { SelectedVariant } from '$lib/types/cart';
import type { Product } from '$lib/types/product';

import ProductVariantItem from '@components/product/ProductVariantItem';

const ProductVariants: React.FC<{
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

		setVariants((prevVariants) => {
			const currentVariantIndexInPrevVariant = prevVariants.findIndex(
				(prevVariant) => prevVariant.name === variant.name
			);

			const newVariants = [...prevVariants];

			if (currentVariantIndexInPrevVariant < 0) {
				newVariants.push({ name: variant.name, option });

				return newVariants;
			}

			newVariants[currentVariantIndexInPrevVariant] = {
				name: variant.name,
				option
			};

			return newVariants;
		});
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

export default ProductVariants;
