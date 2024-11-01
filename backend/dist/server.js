"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const routes_1 = require("./routes/routes");
const config_1 = require("./config");
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const SERVER_PORT = config_1.config.PORT || 5000;
const start = (app) => {
    standardMiddleware(app);
    routesMiddleware(app);
    serveFrontend(app);
    startServer(app);
};
exports.start = start;
const routesMiddleware = (app) => {
    (0, routes_1.appRoutes)(app);
};
const standardMiddleware = (app) => {
    if (config_1.config.NODE_ENV !== 'production') {
        app.use((0, cors_1.default)({
            origin: config_1.config.CLIENT_URL,
            credentials: true,
        }));
    }
    app.use(express_1.default.json({ limit: '5mb' }));
    app.use((0, cookie_parser_1.default)());
};
const serveFrontend = (app) => {
    const frontendPath = path_1.default.join(__dirname, '..', '..', 'frontend', 'dist');
    app.use(express_1.default.static(frontendPath));
    // Catch-all route to serve the index.html for frontend routing
    app.get('*', (_req, res) => {
        res.sendFile(path_1.default.join(frontendPath, 'index.html'));
    });
};
const startServer = (app) => {
    try {
        const httpServer = new http_1.default.Server(app);
        httpServer.listen(SERVER_PORT, () => {
            console.log(`Server started on port ${SERVER_PORT}`);
        });
    }
    catch (error) {
        console.log('Error starting server', error);
    }
};
