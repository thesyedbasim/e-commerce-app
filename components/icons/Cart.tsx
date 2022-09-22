import Link from 'next/link';

const CartIcon: React.FC<{ cartItemsCount?: number }> = ({
	cartItemsCount
}) => {
	return (
		<Link href="/cart" passHref>
			<div className="relative">
				{cartItemsCount ? (
					<div className="item-counter absolute flex items-center justify-center p-2 -top-1.5 -right-1.5 bg-white text-black w-4 h-4 rounded-full font-semibold text-xs">
						{cartItemsCount}
					</div>
				) : null}

				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="w-6"
					viewBox="0 0 512 512"
				>
					<title>Cart</title>
					<circle
						cx="176"
						cy="416"
						r="16"
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="32"
					/>
					<circle
						cx="400"
						cy="416"
						r="16"
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="32"
					/>
					<path
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="32"
						d="M48 80h64l48 272h256"
					/>
					<path
						d="M160 288h249.44a8 8 0 007.85-6.43l28.8-144a8 8 0 00-7.85-9.57H128"
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="32"
					/>
				</svg>
			</div>
		</Link>
	);
};

export default CartIcon;
