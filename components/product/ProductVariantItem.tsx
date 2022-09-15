import { Product, ProductVariant } from '$lib/types/product';
import { NextRouter, useRouter } from 'next/router';

type ProductVariantOption = ProductVariant['options'][0];
type ProductVariantOptionsSize = ProductVariant['optionsSize'];

interface ProductVariantProps {
	router: NextRouter;
	variant: ProductVariant;
	option: ProductVariantOption;
	variantUpdateHandler: (
		variant: ProductVariant,
		option: ProductVariantOption
	) => void;
}

const ProductVariantItemSmallText: React.FC<ProductVariantProps> = ({
	router,
	variant,
	option,
	variantUpdateHandler
}) => {
	return (
		<button
			className={`rounded-full text-lg font-bold bg-gray-${
				router.query[variant.name] === option.name ? '400' : '100'
			} hover:bg-gray-200 w-12 h-12`}
			onClick={() => {
				variantUpdateHandler(variant, option);
			}}
		>
			{option.name}
		</button>
	);
};

const ProductVariantItemSmallColor: React.FC<ProductVariantProps> = ({
	router,
	variant,
	option,
	variantUpdateHandler
}) => {
	return (
		<button
			key={option.name}
			className={`rounded-full w-8 h-8 ${
				router.query[variant.name] === option.name
					? 'outline outline-2 outline-offset-2'
					: 'border border-black'
			}`}
			style={{
				backgroundColor: option.meta?.colorHex as string | '#000000'
			}}
			onClick={() => {
				variantUpdateHandler(variant, option);
			}}
		>
			&nbsp;
		</button>
	);
};

const ProductVariantItemMediumText: React.FC<ProductVariantProps> = ({
	router,
	variant,
	option,
	variantUpdateHandler
}) => {
	return (
		<button
			key={option.name}
			className={`rounded-md px-8 py-4 bg-gray-50 border-2 ${
				router.query[variant.name] === option.name ? 'border-gray-500' : null
			}`}
			onClick={() => {
				variantUpdateHandler(variant, option);
			}}
		>
			{option.name}
		</button>
	);
};

const ProductVariantItemLargeText: React.FC<ProductVariantProps> = () => {
	return <p>Not designed</p>;
};

const ProductVariantItem: React.FC<{
	variant: ProductVariant;
	variantUpdateHandler: ProductVariantProps['variantUpdateHandler'];
}> = ({ variant, variantUpdateHandler }) => {
	const router = useRouter();

	return (
		<div className="space-y-4">
			<h4 className="text-lg font-bold">{variant.name}</h4>
			<div className="space-x-4">
				{variant.options.map((option) => {
					const type = variant.name === 'Color' ? 'Color' : 'Text';
					const size = variant.optionsSize;

					if (type === 'Color')
						return (
							<ProductVariantItemSmallColor
								router={router}
								variant={variant}
								option={option}
								variantUpdateHandler={variantUpdateHandler}
							/>
						);

					if (type === 'Text') {
						if (size === 'small')
							return (
								<ProductVariantItemSmallText
									router={router}
									variant={variant}
									option={option}
									variantUpdateHandler={variantUpdateHandler}
								/>
							);

						if (size === 'medium')
							return (
								<ProductVariantItemMediumText
									router={router}
									variant={variant}
									option={option}
									variantUpdateHandler={variantUpdateHandler}
								/>
							);

						if (size === 'large')
							return (
								<ProductVariantItemLargeText
									router={router}
									variant={variant}
									option={option}
									variantUpdateHandler={variantUpdateHandler}
								/>
							);
					}
				})}
			</div>
		</div>
	);
};

export default ProductVariantItem;
