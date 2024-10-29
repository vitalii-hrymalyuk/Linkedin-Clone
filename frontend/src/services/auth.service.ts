import { axiosInstance } from '../lib/axios';
import { ILogin, ISignUp } from '../types/auth.types';

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
}

export const authService = new AuthService();