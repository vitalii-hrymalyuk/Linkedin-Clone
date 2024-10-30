import { IUser } from './auth.types';

export interface IComment {
  _id?: string;
  user: IUser;
  content: string;
  createdAt: Date;
}
export interface IPost {
  _id?: string;
  author: IUser;
  content?: string;
  image?: string;
  likes: string[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreatePost extends Pick<IPost, 'content' | 'image'> {}
