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
exports.getCurrentUser = exports.logout = exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const user_model_1 = __importDefault(require("../models/user.model"));
const emailHandlers_1 = require("../emails/emailHandlers");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, username, email, password } = req.body;
        if (!name || !username || !email || !password) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }
        if (password.length < 6) {
            res
                .status(400)
                .json({ message: 'Password must be at least 6 characters long' });
            return;
        }
        const existingUser = yield user_model_1.default.findOne({
            $or: [{ email }, { username }],
        });
        if (existingUser) {
            if (existingUser.email === email) {
                res
                    .status(400)
                    .json({ message: 'User with this email already exists' });
                return;
            }
            if (existingUser.username === username) {
                res
                    .status(400)
                    .json({ message: 'User with this username already exists' });
                return;
            }
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const user = yield user_model_1.default.create({
            name,
            email,
            password: hashedPassword,
            username,
        });
        const token = jsonwebtoken_1.default.sign({
            userId: user._id,
        }, config_1.config.JWT_SECRET, { expiresIn: '3d' });
        res.cookie('jwt-linkedin', token, {
            httpOnly: true, // prevent XSS attack
            maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
            sameSite: 'strict', // prevent CSRF attacks
            secure: config_1.config.NODE_ENV === 'production', // prevents man-in-the-middle attacks
        });
        res.status(201).json({ message: 'User registered successfully' });
        const profileUrl = `${config_1.config.CLIENT_URL}/profile/${user.username}`;
        try {
            yield (0, emailHandlers_1.sendWelcomeEmail)(email, name, profileUrl);
        }
        catch (error) {
            console.log('Error sending welcome email:', error);
        }
    }
    catch (error) {
        console.error(`Error in signup: ${error}`);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield user_model_1.default.findOne({ username });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user._id,
        }, config_1.config.JWT_SECRET, { expiresIn: '3d' });
        res.cookie('jwt-linkedin', token, {
            httpOnly: true, // prevent XSS attack	
            maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
            sameSite: 'strict', // prevent CSRF attacks	
            secure: config_1.config.NODE_ENV === 'production', // prevents man-in-the-middle attacks
        });
        res.status(200).json({ message: 'Logged in successfully' });
    }
    catch (error) {
        console.log(`Error in login: ${error}`);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.login = login;
const logout = (_req, res) => {
    res.clearCookie('jwt-linkedin');
    res.json({ message: 'Logged out successfully' });
};
exports.logout = logout;
const getCurrentUser = (req, res) => {
    try {
        res.json(req.user);
    }
    catch (error) {
        console.error(`Error in getCurrentUser: ${error}`);
        res.status(500).send({ message: "Server error" });
    }
};
exports.getCurrentUser = getCurrentUser;
