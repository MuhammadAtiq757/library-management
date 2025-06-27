"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_controller_1 = require("./app/controllers/book.controller");
const borrow_controller_1 = require("./app/controllers/borrow.controller");
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
// routes
app.use("/api/books", book_controller_1.bookRouter);
app.use("/api/borrow", borrow_controller_1.borrowRouter);
// health check
app.get("/", (req, res) => {
    res.send("Library Management is running");
});
// global error handler
const globalErrorHandler = ((error, req, res, next) => {
    if (error.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            error: error,
        });
    }
    res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
        success: false,
        error: error,
    });
});
app.use(globalErrorHandler);
exports.default = app;
