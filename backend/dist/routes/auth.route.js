"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
const authRoutes = () => {
    router.post('/signup', auth_controller_1.signup);
    router.post('/login', auth_controller_1.login);
    router.post('/logout', auth_controller_1.logout);
    router.get('/me', auth_middleware_1.protectRoute, auth_controller_1.getCurrentUser);
    return router;
};
exports.authRoutes = authRoutes;
