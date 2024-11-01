"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
const userRoutes = () => {
    router.get("/suggestions", auth_middleware_1.protectRoute, user_controller_1.getSuggestedConnections);
    router.get("/:username", auth_middleware_1.protectRoute, user_controller_1.getPublicProfile);
    router.put("/profile", auth_middleware_1.protectRoute, user_controller_1.updateProfile);
    return router;
};
exports.userRoutes = userRoutes;
