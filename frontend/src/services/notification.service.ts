import { axiosInstance } from '../lib/axios';

class NotificationService {
	async getNotifications() {
		const res = await axiosInstance.get('/notifications');
		return res.data;
	}

	async markAsRead(id: string) {
		const res = await axiosInstance.put(`/notifications/${id}/read`);
		return res.data;
	}

	async deleteNotification(id: string) {
		const res = await axiosInstance.delete(`/notifications/${id}`);
		return res.data;
	}
}
export const notificationService = new NotificationService();