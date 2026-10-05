export function toDatetimeLocal(utcDate: string) {
	const date = new Date(utcDate);
	date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
	return date.toISOString().slice(0, -1);
}

const calendarDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Format an ISO calendar date (YYYY-MM-DD) without timezone shift. */
export function formatCalendarDate(
	isoDate: string,
	locale = 'en-US',
	options: Intl.DateTimeFormatOptions = {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	},
) {
	const match = calendarDatePattern.exec(isoDate);
	if (match) {
		const year = Number(match[1]);
		const month = Number(match[2]) - 1;
		const day = Number(match[3]);
		return new Date(year, month, day).toLocaleDateString(locale, options);
	}
	return new Date(isoDate).toLocaleDateString(locale, options);
}
