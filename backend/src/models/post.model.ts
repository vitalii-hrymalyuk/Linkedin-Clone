import mongoose, { model, Model, Schema } from 'mongoose';
import { IPost } from '../common/types/post.types';

const postSchema: Schema = new mongoose.Schema(
	{
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		content: { type: String },
		image: { type: String },
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		comments: [
			{
				content: { type: String },
				user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
				createdAt: { type: Date, default: Date.now },
			},
		],
	},
	{ timestamps: true }
);

const PostModel: Model<IPost> = model<IPost>('Post', postSchema)
export default PostModel;