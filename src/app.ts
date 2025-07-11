import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import cors from "cors";

import dotenv from 'dotenv';
import { bookRouter } from "./app/controllers/book.controller";
import { borrowRouter } from "./app/controllers/borrow.controller";
const app = express();

// config dotenv
dotenv.config();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api/books", bookRouter);
app.use("/api/borrow", borrowRouter);

// health check
app.get("/", (req, res) => {
  res.send("Library Management server in running well");
});

// global error handler
const globalErrorHandler = ((error: any, req: Request, res: Response, next: NextFunction) => {
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

app.use(globalErrorHandler as ErrorRequestHandler);

export default app;