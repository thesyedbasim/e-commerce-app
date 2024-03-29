import classNames from 'classnames';

const WishlistIcon: React.FC<{
	size?: string;
	variant?: 'outline' | 'fill';
	fillStyle?: string;
}> = ({ size = 'w-6', variant = 'outline', fillStyle }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={classNames(size, variant === 'fill' ? fillStyle : null)}
			viewBox="0 0 512 512"
		>
			<title>Wishlist</title>
			<path
				d="M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0018 0c96.26-65.34 184.09-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81z"
				fill={variant === 'outline' ? 'none' : 'currentColor'}
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="32"
			/>
		</svg>
	);
};

export default WishlistIcon;
