"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const connection_controller_1 = require("../controllers/connection.controller");
const router = express_1.default.Router();
const connectionRoutes = () => {
    router.post('/request/:userId', auth_middleware_1.protectRoute, connection_controller_1.sendConnectionRequest);
    router.put('/accept/:requestId', auth_middleware_1.protectRoute, connection_controller_1.acceptConnectionRequest);
    router.put('/reject/:requestId', auth_middleware_1.protectRoute, connection_controller_1.rejectConnectionRequest);
    router.get('/requests', auth_middleware_1.protectRoute, connection_controller_1.getConnectionRequests);
    router.get('/', auth_middleware_1.protectRoute, connection_controller_1.getUserConnections);
    router.delete('/:userId', auth_middleware_1.protectRoute, connection_controller_1.removeConnection);
    router.get('/status/:userId', auth_middleware_1.protectRoute, connection_controller_1.getConnectionStatus);
    return router;
};
exports.connectionRoutes = connectionRoutes;
