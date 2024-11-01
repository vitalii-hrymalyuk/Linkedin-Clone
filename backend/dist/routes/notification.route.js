"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const notification_controller_1 = require("../controllers/notification.controller");
const router = express_1.default.Router();
const notificationRoutes = () => {
    router.get('/', auth_middleware_1.protectRoute, notification_controller_1.getUserNotifications);
    router.put('/:id/read', auth_middleware_1.protectRoute, notification_controller_1.markNotificationAsRead);
    router.delete('/:id', auth_middleware_1.protectRoute, notification_controller_1.deleteNotification);
    return router;
};
exports.notificationRoutes = notificationRoutes;
