import { MouseEventHandler } from 'react';

const CrossIcon: React.FC<{ onClick: Function }> = ({ onClick: onClickFn }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="text-gray-300 hover:text-gray-500 cursor-pointer"
			viewBox="0 0 512 512"
			onClick={onClickFn as MouseEventHandler<any>}
		>
			<title>Close</title>
			<path
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="32"
				d="M368 368L144 144M368 144L144 368"
			/>
		</svg>
	);
};

export default CrossIcon;
