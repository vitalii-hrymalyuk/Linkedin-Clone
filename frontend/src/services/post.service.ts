import { axiosInstance } from '../lib/axios';
import { ICreatePost, IPost } from '../types/post.types';

export class PostService {
	async getPosts() {
		const res = await axiosInstance.get<IPost[]>('/posts');
		return res.data;
	}

	async createPost(data: ICreatePost) {
		const res = await axiosInstance.post('/posts/create', data, {
			headers: {
				'Content-Type': 'application/json',
			}
		});
		return res.data;
	}

	async deletePost(id: string) {
		const res = await axiosInstance.delete(`/posts/delete/${id}`);
		return res.data;
	}

	async createComment(id: string, content: string) {
		const res = await axiosInstance.post(`/posts/${id}/comment`, { content });
		return res.data;
	}

	async likePost(id: string) {
		const res = await axiosInstance.post(`/posts/${id}/like`);
		return res.data;
	}
}

export const postService = new PostService();