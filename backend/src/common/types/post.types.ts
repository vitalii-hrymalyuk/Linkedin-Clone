import { Document, Types } from 'mongoose';
interface IComment {
	content: string;
	user: Types.ObjectId;
	createdAt: Date;
}
interface IPost extends Document {
	author: Types.ObjectId;
	content?: string;
	image?: string;
	likes: Types.ObjectId[];
	comments: IComment[];
	createdAt: Date;
	updatedAt: Date;
}

export { IPost, IComment };
