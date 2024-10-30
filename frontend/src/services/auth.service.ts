import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { ILogin, ISignUp, IUser } from '../types/auth.types';

class AuthService {

	async signUp(data: ISignUp) {
		const res = await axiosInstance.post('/auth/signup', data);
		return res.data;
	}

	async login(data: ILogin) {
		const res = await axiosInstance.post('/auth/login', data);
		return res.data;
	}

	async logout() {
		const res = await axiosInstance.post('/auth/logout');
		return res.data;
	}

	async getCurrentUser() {
		try {
			const res = await axiosInstance.get<IUser>('/auth/me');
			return res.data;
		} catch (error: any) {
			if (error.response && error.response.status === 401) {
				return null;
			}
			toast.error(error.response.data.message || 'Something went wrong!');
		}
	}
}
export const authService = new AuthService();