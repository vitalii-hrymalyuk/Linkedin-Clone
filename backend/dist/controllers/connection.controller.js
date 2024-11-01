"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectionStatus = exports.removeConnection = exports.getUserConnections = exports.getConnectionRequests = exports.rejectConnectionRequest = exports.acceptConnectionRequest = exports.sendConnectionRequest = void 0;
const connectionRequest_model_1 = __importDefault(require("../models/connectionRequest.model"));
const connection_types_1 = require("../common/types/connection.types");
const user_model_1 = __importDefault(require("../models/user.model"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const notificaton_types_1 = require("../common/types/notificaton.types");
const config_1 = require("../config");
const emailHandlers_1 = require("../emails/emailHandlers");
const sendConnectionRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { userId } = req.params;
        const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if ((senderId === null || senderId === void 0 ? void 0 : senderId.toString()) === userId) {
            res
                .status(400)
                .send({ message: 'You cannot send a connection request to yourself' });
            return;
        }
        if ((_b = req.user) === null || _b === void 0 ? void 0 : _b.connections.includes(userId)) {
            res.status(400).send({ message: 'You are already connected' });
            return;
        }
        const existingRequest = yield connectionRequest_model_1.default.findOne({
            sender: senderId,
            recipient: userId,
            status: 'pending',
        });
        if (existingRequest) {
            res.status(400).json({ message: 'A connection request already exists' });
            return;
        }
        const newRequest = new connectionRequest_model_1.default({
            sender: senderId,
            recipient: userId,
        });
        yield newRequest.save();
        res.status(200).json({ message: 'Connection request sent successfully' });
    }
    catch (error) {
        console.log(`Error in sendConnectionRequest: ${error}`);
        res.status(500).send({ message: 'Server error' });
    }
});
exports.sendConnectionRequest = sendConnectionRequest;
const acceptConnectionRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { requestId } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const request = yield connectionRequest_model_1.default.findById(requestId)
            .populate('sender', 'name email username')
            .populate('recipient', 'name username');
        if (!request) {
            res.status(404).send({ message: 'Connection request not found' });
            return;
        }
        if (request.recipient._id.toString() !== (userId === null || userId === void 0 ? void 0 : userId.toString())) {
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
        request.status = connection_types_1.ConnectionStatus.ACCEPTED;
        yield request.save();
        yield user_model_1.default.findByIdAndUpdate(request.sender._id, {
            $addToSet: { connections: userId },
        });
        yield user_model_1.default.findByIdAndUpdate(userId, {
            $addToSet: { connections: request.sender._id },
        });
        const notification = new notification_model_1.default({
            recipient: request.sender._id,
            type: notificaton_types_1.NotificationType.CONNECTION_ACCEPTED,
            relatedUser: userId,
        });
        yield notification.save();
        res.json({ message: 'Connection request accepted successfully' });
        const senderEmail = request.sender.email;
        const senderName = request.sender.name;
        const recipientName = request.recipient.name;
        const profileUrl = `${config_1.config.CLIENT_URL}/profile/${recipientName}`;
        try {
            yield (0, emailHandlers_1.sendConnectionAcceptedEmail)(senderEmail, senderName, recipientName, profileUrl);
        }
        catch (error) {
            console.log(`Error in sendWelcomeEmail: ${error}`);
        }
    }
    catch (error) {
        console.log(`Error in acceptConnectionRequest: ${error}`);
        res.status(500).send({ message: 'Server error' });
    }
});
exports.acceptConnectionRequest = acceptConnectionRequest;
const rejectConnectionRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { requestId } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const request = yield connectionRequest_model_1.default.findById(requestId);
        if (((_b = request === null || request === void 0 ? void 0 : request.recipient) === null || _b === void 0 ? void 0 : _b.toString()) !== (userId === null || userId === void 0 ? void 0 : userId.toString())) {
            res
                .status(403)
                .send({ message: 'Not authorized to reject this request' });
            return;
        }
        if ((request === null || request === void 0 ? void 0 : request.status) !== 'pending') {
            res
                .status(400)
                .send({ message: 'This request has already been processed' });
            return;
        }
        request.status = connection_types_1.ConnectionStatus.REJECTED;
        yield request.save();
        res.json({ message: 'Connection request rejected successfully' });
    }
    catch (error) {
        console.log(`Error in rejectConnectionRequest: ${error}`);
        res.status(500).send({ message: 'Server error' });
    }
});
exports.rejectConnectionRequest = rejectConnectionRequest;
const getConnectionRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const requests = yield connectionRequest_model_1.default.find({
            recipient: userId,
            status: connection_types_1.ConnectionStatus.PENDING,
        }).populate('sender', 'name username profilePicture headline connections');
        res.json(requests);
    }
    catch (error) {
        console.log(`Error in getConnectionRequests: ${error}`);
        res.status(500).send({ message: 'Server error' });
    }
});
exports.getConnectionRequests = getConnectionRequests;
const getUserConnections = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const user = yield user_model_1.default.findById(userId).populate('connections', 'name username profilePicture headline connections');
        res.json(user === null || user === void 0 ? void 0 : user.connections);
    }
    catch (error) {
        console.log(`Error in getUserConnections: ${error}`);
        res.status(500).send({ message: 'Server error' });
    }
});
exports.getUserConnections = getUserConnections;
const removeConnection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const myId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { userId } = req.params;
        yield user_model_1.default.findByIdAndUpdate(myId, {
            $pull: { connections: userId },
        });
        yield user_model_1.default.findByIdAndUpdate(userId, {
            $pull: { connections: myId },
        });
        res.json({ message: 'Connection removed successfully' });
    }
    catch (error) {
        console.log(`Error in removeConnection: ${error}`);
        res.status(500).send({ message: 'Server error' });
    }
});
exports.removeConnection = removeConnection;
const getConnectionStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const targetUserId = req.params.userId;
        const currentUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const currentUser = req.user;
        if ((_b = currentUser === null || currentUser === void 0 ? void 0 : currentUser.connections) === null || _b === void 0 ? void 0 : _b.includes(targetUserId)) {
            res.json({ status: 'connected' });
            return;
        }
        const pendingRequest = yield connectionRequest_model_1.default.findOne({
            $or: [
                { sender: currentUserId, recipient: targetUserId },
                { sender: targetUserId, recipient: currentUserId },
            ],
            status: connection_types_1.ConnectionStatus.PENDING,
        });
        if (pendingRequest) {
            if (((_c = pendingRequest.sender) === null || _c === void 0 ? void 0 : _c.toString()) === (currentUserId === null || currentUserId === void 0 ? void 0 : currentUserId.toString())) {
                res.json({ status: connection_types_1.ConnectionStatus.PENDING });
                return;
            }
            else {
                res.json({
                    status: connection_types_1.ConnectionStatus.RECEIVED,
                    requestId: pendingRequest._id,
                });
                return;
            }
        }
        res.json({ status: connection_types_1.ConnectionStatus.NOT_CONNECTED });
    }
    catch (error) {
        console.log(`Error in getConnectionStatus: ${error}`);
        res.status(500).send({ message: 'Server error' });
    }
});
exports.getConnectionStatus = getConnectionStatus;
