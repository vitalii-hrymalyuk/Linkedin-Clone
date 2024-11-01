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
exports.updateProfile = exports.getPublicProfile = exports.getSuggestedConnections = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const getSuggestedConnections = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const currentUser = yield user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id).select('connections');
        const suggestedUsers = yield user_model_1.default.find({
            _id: {
                $ne: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
                $nin: currentUser === null || currentUser === void 0 ? void 0 : currentUser.connections,
            },
        })
            .select('name username profilePicture headline')
            .limit(3);
        res.json(suggestedUsers);
    }
    catch (error) {
        console.error(`Error in getSuggestedConnection: ${error}`);
        res.status(500).send({ message: 'Server error' });
    }
});
exports.getSuggestedConnections = getSuggestedConnections;
const getPublicProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findOne({
            username: req.params.username,
        }).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        else {
            res.json(user);
        }
    }
    catch (error) {
        console.error(`Error in getPublicProfile: ${error}`);
        res.status(500).send({ message: 'Server error' });
    }
});
exports.getPublicProfile = getPublicProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const allowedFields = [
            'name',
            'headline',
            "username",
            'about',
            'location',
            'profilePicture',
            'bannerImg',
            'skills',
            'experience',
            'education',
        ];
        const updatedData = {};
        allowedFields.forEach((field) => {
            if (req.body[field]) {
                updatedData[field] = req.body[field];
            }
        });
        if (req.body.profilePicture) {
            const result = yield cloudinary_1.default.uploader.upload(req.body.profilePicture);
            updatedData.profilePicture = result.secure_url;
        }
        if (req.body.bannerImg) {
            const result = yield cloudinary_1.default.uploader.upload(req.body.bannerImg);
            updatedData.bannerImg = result.secure_url;
        }
        const user = yield user_model_1.default.findByIdAndUpdate((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, { $set: updatedData }, { new: true }).select('-password');
        res.json(user);
    }
    catch (error) {
        console.error(`Error in updateProfile: ${error}`);
        res.status(500).send({ message: 'Server error' });
    }
});
exports.updateProfile = updateProfile;
