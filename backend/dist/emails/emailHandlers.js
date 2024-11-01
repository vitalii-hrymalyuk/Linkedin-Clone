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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendConnectionAcceptedEmail = exports.sendCommentNotificationEmail = exports.sendWelcomeEmail = void 0;
const mailtrap_1 = require("../lib/mailtrap");
const emailTemplates_1 = require("./emailTemplates");
const sendWelcomeEmail = (email, name, profileUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const recipient = [{ email }];
    try {
        const response = yield mailtrap_1.mailtrapClient.send({
            from: mailtrap_1.sender,
            to: recipient,
            subject: 'Welcome to UnLinked',
            html: (0, emailTemplates_1.createWelcomeEmailTemplate)(name, profileUrl),
            category: 'welcome',
        });
        console.log('Welcome Email sent successfully', response);
    }
    catch (error) {
        throw error;
    }
});
exports.sendWelcomeEmail = sendWelcomeEmail;
const sendCommentNotificationEmail = (recipientEmail, recipientName, commenterName, postUrl, commentContent) => __awaiter(void 0, void 0, void 0, function* () {
    const recipient = [{ email: recipientEmail }];
    try {
        const response = yield mailtrap_1.mailtrapClient.send({
            from: mailtrap_1.sender,
            to: recipient,
            subject: 'New comment on your post',
            html: (0, emailTemplates_1.createCommentNotificationEmailTemplate)(recipientName, commenterName, postUrl, commentContent),
            category: 'comment_notification',
        });
        console.log('Comment Notification Email sent successfully', response);
    }
    catch (error) {
        console.log(`Error in sendCommentNotificationEmail: ${error}`);
    }
});
exports.sendCommentNotificationEmail = sendCommentNotificationEmail;
const sendConnectionAcceptedEmail = (senderEmail, senderName, recipientName, profileUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const recipient = [{ email: senderEmail }];
    try {
        const response = yield mailtrap_1.mailtrapClient.send({
            from: mailtrap_1.sender,
            to: recipient,
            subject: `${recipientName} accepted your connection request`,
            html: (0, emailTemplates_1.createConnectionAcceptedEmailTemplate)(senderName, recipientName, profileUrl),
            category: 'connection_accepted',
        });
        console.log('Connection Accepted Email sent successfully', response);
    }
    catch (error) {
        console.log(`Error in sendConnectionAcceptedEmail: ${error}`);
    }
});
exports.sendConnectionAcceptedEmail = sendConnectionAcceptedEmail;
