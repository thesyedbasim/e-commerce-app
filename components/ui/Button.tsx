import { MouseEventHandler, useState } from 'react';
import cn from 'classnames';

const Button: React.FC<{
	text: string;
	attributes?: any;
	style?: { size: 'sm' | 'md'; width: string };
	functions?: { onClick: MouseEventHandler<HTMLButtonElement> };
}> = ({
	text,
	attributes,
	style = { size: 'md', width: 'full' },
	functions
}) => {
	const [styles, setStyles] = useState<string[]>([
		`py-${style.size === 'sm' ? '2' : '4'}`,
		`px-${style.size === 'sm' ? '2' : '4'}`,
		'font-semibold',
		'uppercase',
		'bg-black',
		'hover:bg-gray-800',
		'focus:bg-gray-800',
		'focus:outline-none',
		'text-white',
		`w-${style.width}`,
		`text-${style.size}`
	]);

	return (
		<button className={cn(styles)} onClick={functions?.onClick} {...attributes}>
			{text}
		</button>
	);
};

export default Button;
