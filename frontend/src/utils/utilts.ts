import { isValid, parseISO, format } from 'date-fns';

export const readFileAsDataUrl = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	})
};

export const formatDate = (dateString: string) => {
	const date = parseISO(dateString);
	return isValid(date) ? format(date, 'MMM yyyy') : 'Present'
}

