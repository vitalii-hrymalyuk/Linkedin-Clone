"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const post_controller_1 = require("../controllers/post.controller");
const router = express_1.default.Router();
const postRoutes = () => {
    router.get('/', auth_middleware_1.protectRoute, post_controller_1.getFeedPosts);
    router.post('/create', auth_middleware_1.protectRoute, post_controller_1.createPost);
    router.delete('/delete/:id', auth_middleware_1.protectRoute, post_controller_1.deletePost);
    router.get('/:id', auth_middleware_1.protectRoute, post_controller_1.getPostById);
    router.post('/:id/comment', auth_middleware_1.protectRoute, post_controller_1.createComment);
    router.post('/:id/like', auth_middleware_1.protectRoute, post_controller_1.likePost);
    return router;
};
exports.postRoutes = postRoutes;
