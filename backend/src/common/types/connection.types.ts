import { PopulatedDoc, Types, Document } from 'mongoose'
import IUser from './user.type'

enum ConnectionStatus {
	PENDING = 'pending',
	ACCEPTED = 'accepted',
	REJECTED = 'rejected',
	RECEIVED = 'received',
	NOT_CONNECTED = 'not_connected',
}

interface IConnection extends Document {
	_id: Types.ObjectId
	sender: Types.ObjectId | PopulatedDoc<IUser>
	recipient: Types.ObjectId | PopulatedDoc<IUser>
	status: ConnectionStatus
	createdAt: Date
	updatedAt: Date
}

export { IConnection, ConnectionStatus }