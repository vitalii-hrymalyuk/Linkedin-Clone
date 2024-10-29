export interface INotification {
	type: NotificationType
	read: boolean
	createdAt: Date
	updatedAt: Date
}

enum NotificationType {
	LIKE = 'like',
	COMMENT = 'comment',
	CONNECTION_ACCEPTED = 'connectionAccepted',
}