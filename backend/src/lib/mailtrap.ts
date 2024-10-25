import { MailtrapClient } from 'mailtrap';
import { config } from '../config';

const TOKEN = config.MAILTRAP_TOKEN;

export const mailtrapClient = new MailtrapClient({
	token: TOKEN!
});

export const sender = {
	email: config.EMAIL_FROM!,
	name: config.EMAIL_FROM_NAME!,
}