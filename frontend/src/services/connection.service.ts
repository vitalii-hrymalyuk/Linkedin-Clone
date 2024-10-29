import { axiosInstance } from '../lib/axios';

class ConnectionService {
	async getConnections() {
		const res = await axiosInstance.get('/connections/requests');
		return res.data;
	}
}
export const connectionService = new ConnectionService();