import classNames from 'classnames';

const StarIcon: React.FC<{
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
			<title>Star</title>
			<path
				d="M480 208H308L256 48l-52 160H32l140 96-54 160 138-100 138 100-54-160z"
				fill={variant === 'outline' ? 'none' : 'currentColor'}
				stroke="currentColor"
				strokeLinejoin="round"
				strokeWidth="32"
			/>
		</svg>
	);
};

export default StarIcon;
