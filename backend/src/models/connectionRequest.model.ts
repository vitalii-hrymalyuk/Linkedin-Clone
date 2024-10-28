import mongoose, { model, Model } from 'mongoose';
import { ConnectionStatus, IConnection } from '../common/types/connection.types';

const connectionRequestSchema = new mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		recipient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		status: {
			type: String,
			enum: Object.values(ConnectionStatus),
			default: ConnectionStatus.PENDING,
		},
	},
	{ timestamps: true }
)

const ConnectionRequestModel: Model<IConnection> = model<IConnection>('ConnectionRequest', connectionRequestSchema);
export default ConnectionRequestModel;