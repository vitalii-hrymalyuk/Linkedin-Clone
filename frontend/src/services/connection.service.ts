import { axiosInstance } from '../lib/axios';
import { ConnectionStatus } from '../types/connection.types';

class ConnectionService {
	async getConnections() {
		const res = await axiosInstance.get('/connections/requests');
		return res.data;
	}

	async getConnectionStatus(userId: string) {
		const res = await axiosInstance.get(`/connections/status/${userId}`);
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

}
export const connectionService = new ConnectionService();