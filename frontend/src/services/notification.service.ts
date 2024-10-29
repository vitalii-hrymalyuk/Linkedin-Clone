import { axiosInstance } from '../lib/axios';

class NotificationService {
	async getNotifications() {
		const res = await axiosInstance.get('/notifications');
		return res.data;
	}
}
export const notificationService = new NotificationService();