import mongoose, { model, Model, Schema } from 'mongoose';
import { INotification } from '../common/types/notificaton.types';

const notificationSchema = new mongoose.Schema(
	{
		recipient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		type: {
			type: String,
			required: true,
			enum: ['like', 'comment', 'connectionAccepted'],
		},
		relatedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		relatedPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
		read: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

const NotificationModel: Model<INotification> = model<INotification>('Notification', notificationSchema);
export default NotificationModel;