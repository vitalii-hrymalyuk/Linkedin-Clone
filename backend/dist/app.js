"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("./server");
const db_1 = require("./lib/db");
const initialize = () => {
    (0, db_1.connectDB)();
    const app = (0, express_1.default)();
    (0, server_1.start)(app);
};
initialize();
