/**
 * Shorten a string to the given length
 */
export function truncate (text: string, length = 100): string {
	return text.length > length ? text.slice(0, length).trim() + '...' : text;
}

/**
 * Generate a slug from a string
 * @param text - The string to slugify
 * @returns The slugified string
 */
export function slug (text?: string): string {
	return text?.trim()
		.toLowerCase()
		.replace(/'/g, '')
		.replace(/[^\w/-]+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-+|-+$/g, '')
		.replace(/^\/+|\/+$/g, '') ?? '';
}

/**
 * Generate a title from a slug
 * @param slug - The slug to generate a title from
 * @returns The title
 */
export function unslug (slug: string): string {
	return titleCase(slug.replace(/[-/]+/g, ' '));
}

/**
 * Format a phone number
 * @param phone - The phone number to format
 * @returns The formatted phone number
 */
export function formatPhone (phone?: string | number): string {
	const given = phone?.toString().trim() ?? '';
	if (given === '(' || given === '') {
		return given;
	}

	let numbers = given.replace(/\D/g, '') ?? '',
		formatted = '';

	if (numbers.length > 10) {
		formatted += `+${numbers.slice(0, numbers.length - 10)} `;
		numbers = numbers.slice(numbers.length - 10);
	}

	for (var i = 0; i < numbers.length; i++) {
		switch (i) {
			case 0:
				formatted += '(';
				break;
			case 3:
				formatted += ') ';
				break;
			case 6:
				formatted += '-';
				break;
		}
		formatted += numbers[i];
	}

	switch (given[given.length - 1]) {
		case ')':
			if (i === 3) {
				formatted += ') ';
			}
			break;
		case '-':
			if (i === 6) {
				formatted += '-';
			}
			break;
	}

	return formatted;
}

/**
 * Pluralize the given word
 */
export function plural (word: string): string {
	if (word.endsWith('ies') ||
		word.endsWith('es') ||
		(word.endsWith('s') && !word.endsWith('us') && !word.endsWith('is') && !word.endsWith('ss'))) {
		return word;
	}

	if (word.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(word.charAt(word.length - 2))) {
		return word.slice(0, -1) + 'ies';
	}

	if (word.endsWith('s') || word.endsWith('sh') || word.endsWith('ch') || word.endsWith('x') || word.endsWith('z')) {
		return word + 'es';
	}

	return word + 's';
}

/**
 * Capitalize the first letter of the given word
 */
export function titleCase (text: string): string {
	return text
		.toLowerCase()
		.replace(/(?:^|\s)\S/g, a => a.toUpperCase());
}

/**
 * Copies the provided text to the clipboard
 * @param text - the text to copy
 * @returns - true if the text was successfully copied to the clipboard; else false
 */
export function copyText (text: string) : boolean {
	const textArea: HTMLTextAreaElement = document.createElement('textarea');

	if (!text || !textArea) {
		return false;
	}

	textArea.value = text;
	textArea.style.cssText = `
		position: fixed;
		top: 0;
		left: 0;
		transform: translate(-100%, -100%);
		opacity: 0;
		z-index: -1;
	`;

	document.body.appendChild(textArea);
	textArea.select();
	textArea.setSelectionRange(0, 99999);
	navigator.clipboard.writeText(textArea.value);
	document.body.removeChild(textArea);

	return true;
}

/**
 * Tests the validity of an email address
 * @see {@link https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression}
 * @param text - the string to test
 * @returns - true if the given string is an email address; false if not
 */
export function isEmail (text: string) : boolean {
	return null !== (/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.exec(text));
}

/**
 * Generate a random string [a-z0-9]
 */
export function generateId(length = 10): string {
	return Math.random().toString(36).substring(2, length + 2);
}

/**
 * Check if the given string is an image url
 */
export function isImage (src?: string): boolean {
	return !!src?.match(/\.(jpe?g|png|webp|gif|svg)$/i);
}

/**
 * Check if the given string is a video url
 */
export function isVideo (src?: string): boolean {
	return !!src?.match(/\.(mp4|webm|ogg)$/i);
}
