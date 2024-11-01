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
exports.likePost = exports.createComment = exports.getPostById = exports.deletePost = exports.createPost = exports.getFeedPosts = void 0;
const post_model_1 = __importDefault(require("../models/post.model"));
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const config_1 = require("../config");
const emailHandlers_1 = require("../emails/emailHandlers");
const getFeedPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const posts = yield post_model_1.default.find({
            author: { $in: [...(_a = req.user) === null || _a === void 0 ? void 0 : _a.connections, (_b = req.user) === null || _b === void 0 ? void 0 : _b._id] },
        })
            .populate('author', 'name username profilePicture headline')
            .populate('comments.user', 'name profilePicture')
            .sort({ createdAt: -1 });
        res.status(200).json(posts);
    }
    catch (error) {
        console.error(`Error in getFeedPosts: ${error}`);
        res.status(500).send({ message: 'Server error' });
    }
});
exports.getFeedPosts = getFeedPosts;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { content, image } = req.body;
        let newPost;
        if (image) {
            const imageResult = yield cloudinary_1.default.uploader.upload(image);
            newPost = new post_model_1.default({
                author: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
                content,
                image: imageResult.secure_url,
            });
        }
        else {
            newPost = new post_model_1.default({
                author: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
                content,
            });
        }
        yield newPost.save();
        res.status(201).json(newPost);
    }
    catch (error) {
        console.error(`Error in createPost: ${error}`);
        res.status(500).send({ message: 'Server error' });
    }
});
exports.createPost = createPost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const postId = req.params.id;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const post = yield post_model_1.default.findById(postId);
        if (!post) {
            res.status(404).send({ message: 'Post not found' });
            return;
        }
        if (post.author.toString() !== userId.toString()) {
            res
                .status(403)
                .send({ message: 'You are not authorized to delete this post' });
            return;
        }
        if (post.image) {
            yield cloudinary_1.default.uploader.destroy((_b = post.image.split('/').pop()) === null || _b === void 0 ? void 0 : _b.split('.')[0]);
        }
        yield post_model_1.default.findByIdAndDelete(postId);
        res.status(200).send({ message: 'Post deleted successfully' });
    }
    catch (error) {
        console.error(`Error in deletePost: ${error}`);
        res.status(500).send({ message: 'Server error' });
    }
});
exports.deletePost = deletePost;
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.id;
        const post = yield post_model_1.default.findById(postId)
            .populate('author', 'name username profilePicture headline')
            .populate('comments.user', 'name username profilePicture headline');
        res.status(200).json(post);
    }
    catch (error) {
        console.log(`Error in getPostById: ${error}`);
        res.status(500).send({ message: 'Server error' });
    }
});
exports.getPostById = getPostById;
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const postId = req.params.id;
        const { content } = req.body;
        const post = yield post_model_1.default.findByIdAndUpdate(postId, {
            $push: { comments: { user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id, content } },
        }, { new: true }).populate('author', 'name username profilePicture headline email');
        if (((_b = post === null || post === void 0 ? void 0 : post.author) === null || _b === void 0 ? void 0 : _b._id.toString()) !== ((_c = req.user) === null || _c === void 0 ? void 0 : _c._id.toString())) {
            const newNotification = new notification_model_1.default({
                recipient: post === null || post === void 0 ? void 0 : post.author,
                type: 'comment',
                relatedUser: (_d = req.user) === null || _d === void 0 ? void 0 : _d._id,
                relatedPost: postId,
            });
            yield newNotification.save();
            try {
                const postUrl = `${config_1.config.CLIENT_URL}/post/${postId}`;
                yield (0, emailHandlers_1.sendCommentNotificationEmail)(post === null || post === void 0 ? void 0 : post.author.email, post === null || post === void 0 ? void 0 : post.author.name, (_e = req.user) === null || _e === void 0 ? void 0 : _e.name, postUrl, content);
            }
            catch (error) {
                console.log(`Error in sendCommentNotificationEmail: ${error}`);
            }
        }
        res.status(200).json(post);
    }
    catch (error) {
        console.log(`Error in createComment: ${error}`);
        res.status(500).send({ message: 'Server error' });
    }
});
exports.createComment = createComment;
const likePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const postId = req.params.id;
        const post = yield post_model_1.default.findById(postId);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (userId && post) {
            if (post === null || post === void 0 ? void 0 : post.likes.includes(userId)) {
                post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
            }
            else {
                post === null || post === void 0 ? void 0 : post.likes.push(userId);
                if (post.author.toString() !== userId.toString()) {
                    const newNotification = new notification_model_1.default({
                        recipient: post === null || post === void 0 ? void 0 : post.author,
                        type: 'like',
                        relatedUser: userId,
                        relatedPost: postId,
                    });
                    yield newNotification.save();
                }
            }
        }
        yield post.save();
        res.status(200).json(post);
    }
    catch (error) {
        console.log(`Error in likePost: ${error}`);
        res.status(500).send({ message: 'Server error' });
    }
});
exports.likePost = likePost;
