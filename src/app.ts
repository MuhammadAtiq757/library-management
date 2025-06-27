import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import { bookRouter } from "./app/controllers/book.controller";
import { borrowRouter } from "./app/controllers/borrow.controller";
import dotenv from 'dotenv';
const app = express();


dotenv.config();

app.use(express.json());
// routes
app.use("/api/books", bookRouter);
app.use("/api/borrow", borrowRouter);

// health check
app.get("/", (req, res) => {
  res.send("Library Management is running");
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
