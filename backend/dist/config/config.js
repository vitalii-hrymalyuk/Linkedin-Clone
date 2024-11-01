"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({});
class Config {
    constructor() {
        this.PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : undefined;
        this.MONGO_URI = process.env.MONGO_URI || '';
        this.JWT_SECRET = process.env.JWT_SECRET || '';
        this.NODE_ENV = process.env.NODE_ENV || '';
        this.MAILTRAP_TOKEN = process.env.MAILTRAP_TOKEN || '';
        this.EMAIL_FROM = process.env.EMAIL_FROM || '';
        this.EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || '';
        this.CLIENT_URL = process.env.CLIENT_URL || '';
        this.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '';
        this.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';
        this.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || '';
    }
}
exports.config = new Config();
