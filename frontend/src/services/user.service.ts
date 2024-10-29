import { axiosInstance } from '../lib/axios';

export class UserService {
	async getRecommendedUsers() {
		const res = await axiosInstance.get<string[]>('/users/suggestions');
		return res.data;
	}

}

export const userService = new UserService();