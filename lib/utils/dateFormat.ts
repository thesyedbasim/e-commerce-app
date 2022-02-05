/**
 * Formats the date object to human readable string
 * @param date the date to format
 * @returns the formatted date
 */
export const dateFormat = (date: Date): string => {
	let day: number | string = date.getDate();
	day = day < 9 ? `0${day}` : `${day}`;
	let month: number | string = date.getMonth();
	month = month < 9 ? `0${month}` : `${month}`;
	const year = date.getFullYear();

	const formatted = `${day}/${month}/${year}`;

	return formatted;
};
