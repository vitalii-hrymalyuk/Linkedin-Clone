"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: config_1.config.CLOUDINARY_CLOUD_NAME,
    api_key: config_1.config.CLOUDINARY_API_KEY,
    api_secret: config_1.config.CLOUDINARY_API_SECRET,
});
exports.default = cloudinary_1.v2;
