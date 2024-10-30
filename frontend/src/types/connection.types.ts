export enum ConnectionStatus {
	PENDING = 'pending',
	ACCEPTED = 'accepted',
	REJECTED = 'rejected',
	RECEIVED = 'received',
	NOT_CONNECTED = 'not_connected',
	CONNECTED = 'connected',
}

export interface IConnection {
	status: ConnectionStatus
	createdAt: Date
	updatedAt: Date
}