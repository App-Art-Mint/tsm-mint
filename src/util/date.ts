export function toDatetimeLocal(utcDate: string) {
	const date = new Date(utcDate);
	date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
	return date.toISOString().slice(0, -1);
}
