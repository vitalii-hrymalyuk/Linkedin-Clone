import { axiosInstance } from '../lib/axios';
import { IUser } from '../types/auth.types';

export class UserService {
	async getRecommendedUsers() {
		const res = await axiosInstance.get<IUser[]>('/users/suggestions');
		return res.data;
	}

}

export const userService = new UserService();