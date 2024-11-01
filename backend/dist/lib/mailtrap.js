"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sender = exports.mailtrapClient = void 0;
const mailtrap_1 = require("mailtrap");
const config_1 = require("../config");
const TOKEN = config_1.config.MAILTRAP_TOKEN;
exports.mailtrapClient = new mailtrap_1.MailtrapClient({
    token: TOKEN
});
exports.sender = {
    email: config_1.config.EMAIL_FROM,
    name: config_1.config.EMAIL_FROM_NAME,
};
