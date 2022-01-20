export default function debounce(func: () => any, wait: number, immediate?: boolean) {
	let timeout: NodeJS.Timeout;

	return (...args) => {
		const later = function () {
			timeout = null;
			if (!immediate) func.apply(this, args);
		};

		const callNow = immediate && !timeout;

		clearTimeout(timeout);

		timeout = setTimeout(later, wait);

		if (callNow) func.apply(this, args);
	};
}
