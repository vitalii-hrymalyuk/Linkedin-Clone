import { IUser } from './auth.types'

export enum ConnectionStatus {
	PENDING = 'pending',
	ACCEPTED = 'accepted',
	REJECTED = 'rejected',
	RECEIVED = 'received',
	NOT_CONNECTED = 'not_connected',
	CONNECTED = 'connected',
}

export interface IConnection {
	_id: string
	name: string
	status: ConnectionStatus
	sender: IUser
	createdAt: Date
	updatedAt: Date
}