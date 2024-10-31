import { axiosInstance } from '../lib/axios';
import { IConnection } from '../types/connection.types';

class ConnectionService {
	async getConnectionsRequests() {
		const res = await axiosInstance.get<IConnection[]>('/connections/requests');
		return res.data;
	}

	async getConnectionStatus(userId: string) {
		const res = await axiosInstance.get<IConnection>(`/connections/status/${userId}`);
		return res.data;
	}

	async sendConnectionRequest(userId: string) {
		const res = await axiosInstance.post(`/connections/request/${userId}`);
		return res.data;
	}

	async acceptRequest(requestId: string) {
		const res = await axiosInstance.put(`/connections/accept/${requestId}`);
		return res.data;
	}

	async rejectRequest(requestId: string) {
		const res = await axiosInstance.put(`/connections/reject/${requestId}`);
		return res.data;
	}

	async getUserConnections() {
		const res = await axiosInstance.get<IConnection[]>(`/connections`);
		return res.data;
	}

	async removeConnection(userId: string) {
		const res = await axiosInstance.delete(`/connections/${userId}`);
		return res.data;
	}

}
export const connectionService = new ConnectionService();