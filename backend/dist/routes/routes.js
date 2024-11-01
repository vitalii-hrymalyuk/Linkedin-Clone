"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRoutes = void 0;
const auth_route_1 = require("./auth.route");
const user_route_1 = require("./user.route");
const post_route_1 = require("./post.route");
const notification_route_1 = require("./notification.route");
const connection_route_1 = require("./connection.route");
const BASE_PATH = '/api/v1';
const appRoutes = (app) => {
    app.use(`${BASE_PATH}/auth`, (0, auth_route_1.authRoutes)());
    app.use(`${BASE_PATH}/users`, (0, user_route_1.userRoutes)());
    app.use(`${BASE_PATH}/posts`, (0, post_route_1.postRoutes)());
    app.use(`${BASE_PATH}/notifications`, (0, notification_route_1.notificationRoutes)());
    app.use(`${BASE_PATH}/connections`, (0, connection_route_1.connectionRoutes)());
};
exports.appRoutes = appRoutes;
