"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = void 0;
const sendError = (res, message, error, statusCode = 400) => {
    res.status(statusCode).json({
        message,
        success: false,
        error,
    });
};
exports.sendError = sendError;
