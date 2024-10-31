import { axiosInstance } from '../lib/axios';
import { IUser } from '../types/auth.types';

export class UserService {
	async getRecommendedUsers() {
		const res = await axiosInstance.get<IUser[]>('/users/suggestions');
		return res.data;
	}

	async getUserProfile(username: string) {
		const res = await axiosInstance.get<IUser>(`/users/${username}`);
		return res.data;
	}

	async updateProfile(updatedData: Partial<IUser>) {
		const res = await axiosInstance.put<IUser>('/users/profile', updatedData);
		return res.data;
	}
}

export const userService = new UserService();