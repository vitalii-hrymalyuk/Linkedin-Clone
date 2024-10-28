import { Types } from 'mongoose'

interface INotification {
	recipient: Types.ObjectId
	type: NotificationType
	relatedUser?: Types.ObjectId
	relatedPost?: Types.ObjectId
	read: boolean
	createdAt: Date
	updatedAt: Date
}

enum NotificationType {
	LIKE = 'like',
	COMMENT = 'comment',
	CONNECTION_ACCEPTED = 'connectionAccepted',
}

export { INotification, NotificationType }