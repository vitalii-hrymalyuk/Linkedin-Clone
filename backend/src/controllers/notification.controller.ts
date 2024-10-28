import { AuthenticatedRequest } from '../common/types/user.type';
import { Response } from 'express';
import NotificationModel from '../models/notification.model';

export const getUserNotifications = async (
	req: AuthenticatedRequest,
	res: Response
) => {
	try {
		const notifications = await NotificationModel.find({
			recipient: req.user?._id,
		})
			.sort({ createdAt: -1 })
			.populate('relatedUser', 'name username profilePicture')
			.populate('relatedPost', 'content image');
		res.status(200).json(notifications);
	} catch (error) {
		console.error(`Error in getUserNotifications: ${error}`);
		res.status(500).send({ message: 'Server error' });
	}
};

export const markNotificationAsRead = async (
	req: AuthenticatedRequest,
	res: Response
) => {
	const notificationId = req.params.id;
	try {
		const notification = await NotificationModel.findByIdAndUpdate(
			{ _id: notificationId, recipient: req.user?._id },
			{ read: true },
			{ new: true }
		);
		res.status(200).json(notification);
	} catch (error) {
		console.log(`Error in markNotificationAsRead: ${error}`);
		res.status(500).send({ message: 'Server error' });
	}
};

export const deleteNotification = async (
	req: AuthenticatedRequest,
	res: Response
) => {
	const notificationId = req.params.id;
	try {
		await NotificationModel.findByIdAndDelete({
			_id: notificationId,
			recipient: req.user?._id,
		});
		res.json({ message: 'Notification deleted successfully' });
	} catch (error) {
		console.log(`Error in deleteNotification: ${error}`);
		res.status(500).send({ message: 'Server error' });
	}
};
