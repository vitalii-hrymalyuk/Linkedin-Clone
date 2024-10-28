import { Response } from 'express';
import IUser, { AuthenticatedRequest } from '../common/types/user.type';
import ConnectionRequestModel from '../models/connectionRequest.model';
import { Schema } from 'mongoose';
import { ConnectionStatus } from '../common/types/connection.types';
import UserModel from '../models/user.model';
import NotificationModel from '../models/notification.model';
import { NotificationType } from '../common/types/notificaton.types';
import { config } from '../config';
import { sendConnectionAcceptedEmail } from '../emails/emailHandlers';

export const sendConnectionRequest = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { userId } = req.params;
    const senderId = req.user?._id;

    if (senderId?.toString() === userId) {
      res
        .status(400)
        .send({ message: 'You cannot send a connection request to yourself' });
      return;
    }

    if (
      req.user?.connections!.includes(
        userId as unknown as Schema.Types.ObjectId
      )
    ) {
      res.status(400).send({ message: 'You are already connected' });
      return;
    }

    const existingRequest = await ConnectionRequestModel.findOne({
      sender: senderId,
      recipient: userId,
      status: 'pending',
    });

    if (existingRequest) {
      res.status(400).json({ message: 'A connection request already exists' });
      return;
    }

    const newRequest = new ConnectionRequestModel({
      sender: senderId,
      recipient: userId,
    });
    await newRequest.save();

    res.status(200).json({ message: 'Connection request sent successfully' });
  } catch (error) {
    console.log(`Error in sendConnectionRequest: ${error}`);
    res.status(500).send({ message: 'Server error' });
  }
};

export const acceptConnectionRequest = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { requestId } = req.params;
    const userId = req.user?._id;

    const request = await ConnectionRequestModel.findById(requestId)
      .populate<{ sender: IUser }>('sender', 'name email username')
      .populate<{ recipient: IUser }>('recipient', 'name username');

    if (!request) {
      res.status(404).send({ message: 'Connection request not found' });
      return;
    }

    if (request.recipient._id!.toString() !== userId?.toString()) {
      res
        .status(403)
        .send({ message: 'Not authorized to accept this request' });
      return;
    }

    if (request.status !== 'pending') {
      res
        .status(400)
        .send({ message: 'This request has already been processed' });
      return;
    }

    request.status = ConnectionStatus.ACCEPTED;
    await request.save();

    await UserModel.findByIdAndUpdate(request.sender!._id, {
      $addToSet: { connections: userId },
    });
    await UserModel.findByIdAndUpdate(userId, {
      $addToSet: { connections: request.sender!._id },
    });

    const notification = new NotificationModel({
      recipient: request.sender!._id,
      type: NotificationType.CONNECTION_ACCEPTED,
      relatedUser: userId,
    });

    await notification.save();

    res.json({ message: 'Connection request accepted successfully' });

    const senderEmail = request.sender.email;
    const senderName = request.sender.name;
    const recipientName = request.recipient.name;

    const profileUrl = `${config.CLIENT_URL}/profile/${recipientName}`;

    try {
      await sendConnectionAcceptedEmail(
        senderEmail,
        senderName,
        recipientName,
        profileUrl
      );
    } catch (error) {
      console.log(`Error in sendWelcomeEmail: ${error}`);
    }
  } catch (error) {
    console.log(`Error in acceptConnectionRequest: ${error}`);
    res.status(500).send({ message: 'Server error' });
  }
};

export const rejectConnectionRequest = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { requestId } = req.params;
    const userId = req.user?._id;

    const request = await ConnectionRequestModel.findById(requestId);

    if (request?.recipient?.toString !== userId?.toString()) {
      res
        .status(403)
        .send({ message: 'Not authorized to reject this request' });
      return;
    }

    if (request?.status !== 'pending') {
      res
        .status(400)
        .send({ message: 'This request has already been processed' });
      return;
    }

    request.status = ConnectionStatus.REJECTED;
    await request.save();

    res.json({ message: 'Connection request rejected successfully' });
  } catch (error) {
    console.log(`Error in rejectConnectionRequest: ${error}`);
    res.status(500).send({ message: 'Server error' });
  }
};

export const getConnectionRequests = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?._id;

    const requests = await ConnectionRequestModel.find({
      recipient: userId,
      status: ConnectionStatus.PENDING,
    }).populate<{ sender: IUser }>(
      'sender',
      'name username profilePicture headline connections'
    );

    res.json(requests);
  } catch (error) {
    console.log(`Error in getConnectionRequests: ${error}`);
    res.status(500).send({ message: 'Server error' });
  }
};

export const getUserConnections = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?._id;

    const user = await UserModel.findById(userId).populate(
      'connections',
      'name username profilePicture headline connections'
    );

    res.json(user?.connections);
  } catch (error) {
    console.log(`Error in getUserConnections: ${error}`);
    res.status(500).send({ message: 'Server error' });
  }
};

export const removeConnection = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const myId = req.user?._id;

    const { userId } = req.params;

    await UserModel.findByIdAndUpdate(myId, {
      $pull: { connections: userId },
    });
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { connections: myId },
    });
    res.json({ message: 'Connection removed successfully' });
  } catch (error) {
    console.log(`Error in removeConnection: ${error}`);
    res.status(500).send({ message: 'Server error' });
  }
};

export const getConnectionStatus = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const targetUserId = req.params.userId;

    const currentUserId = req.user?._id;

    const currentUser = req.user;

    if (
      currentUser?.connections?.includes(
        targetUserId as unknown as Schema.Types.ObjectId
      )
    ) {
      res.json({ status: 'connected' });
      return;
    }

    const pendingRequest = await ConnectionRequestModel.findOne({
      $or: [
        { sender: currentUserId, recipient: targetUserId },
        { sender: targetUserId, recipient: currentUserId },
      ],
      status: ConnectionStatus.PENDING,
    });

    if (pendingRequest) {
      if (pendingRequest.sender?.toString() === currentUserId?.toString()) {
        res.json({ status: ConnectionStatus.PENDING });
        return;
      } else {
        res.json({
          status: ConnectionStatus.RECEIVED,
          requestId: pendingRequest._id,
        });
        return;
      }
    }

		res.json({ status: ConnectionStatus.NOT_CONNECTED });
  } catch (error) {
    console.log(`Error in getConnectionStatus: ${error}`);
    res.status(500).send({ message: 'Server error' });
  }
};
