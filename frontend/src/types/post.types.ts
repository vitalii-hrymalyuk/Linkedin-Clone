interface IComment {
  content: string;
  createdAt: Date;
}
export interface IPost {
  content?: string;
  image?: string;
  likes: string[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreatePost extends Pick<IPost, 'content' | 'image'> {}
