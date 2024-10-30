import { IUser } from './auth.types'
import { IPost } from './post.types'

export interface INotification {
	_id?: string
	type: NotificationType
	read: boolean
	relatedUser: IUser
	relatedPost: IPost
	createdAt: Date
	updatedAt: Date
}

export enum NotificationType {
	LIKE = 'like',
	COMMENT = 'comment',
	CONNECTION_ACCEPTED = 'connectionAccepted',
}