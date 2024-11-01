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
exports.deleteNotification = exports.markNotificationAsRead = exports.getUserNotifications = void 0;
const notification_model_1 = __importDefault(require("../models/notification.model"));
const getUserNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const notifications = yield notification_model_1.default.find({
            recipient: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        })
            .sort({ createdAt: -1 })
            .populate('relatedUser', 'name username profilePicture')
            .populate('relatedPost', 'content image');
        res.status(200).json(notifications);
    }
    catch (error) {
        console.error(`Error in getUserNotifications: ${error}`);
        res.status(500).send({ message: 'Server error' });
    }
});
exports.getUserNotifications = getUserNotifications;
const markNotificationAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const notificationId = req.params.id;
    try {
        const notification = yield notification_model_1.default.findByIdAndUpdate({ _id: notificationId, recipient: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }, { read: true }, { new: true });
        res.status(200).json(notification);
    }
    catch (error) {
        console.log(`Error in markNotificationAsRead: ${error}`);
        res.status(500).send({ message: 'Server error' });
    }
});
exports.markNotificationAsRead = markNotificationAsRead;
const deleteNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const notificationId = req.params.id;
    try {
        yield notification_model_1.default.findByIdAndDelete({
            _id: notificationId,
            recipient: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        });
        res.json({ message: 'Notification deleted successfully' });
    }
    catch (error) {
        console.log(`Error in deleteNotification: ${error}`);
        res.status(500).send({ message: 'Server error' });
    }
});
exports.deleteNotification = deleteNotification;
