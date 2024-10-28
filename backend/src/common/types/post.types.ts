import { Document, PopulatedDoc, Types } from 'mongoose';
import IUser from './user.type';
interface IComment {
	content: string;
	user: Types.ObjectId;
	createdAt: Date;
}
interface IPost extends Document {
	author: Types.ObjectId | PopulatedDoc<IUser>;
	content?: string;
	image?: string;
	likes: Types.ObjectId[];
	comments: IComment[];
	createdAt: Date;
	updatedAt: Date;
}

export { IPost, IComment };
