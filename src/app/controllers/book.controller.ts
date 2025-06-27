import express, { NextFunction, Request, Response } from "express";
import { Book } from "../models/book.model";
import { sendError } from "../../utils/handleError";

export const bookRouter = express.Router();


bookRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    try {
      const book = await Book.create(body);
      res.status(201).json({
        success: true,
        message: "Book created successfully",
        data: book,
      });
    } catch (error) {
      next(error);
    }
  }
);


bookRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const { filter, sortBy, sort, limit } = req.query;
  const query: any = {};
  
  if (filter) {
    query.genre = filter;
  }
  try {
    const books = await Book.find(query)
      .sort({ [sortBy as string]: sort === "desc" ? -1 : 1 })
      .limit(Number(limit));
    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error) {
    next(error);
  }
});


bookRouter.get(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;
    try {
      const book = await Book.findById(bookId);
      if(!book) {
        return sendError(res, "Book not found", null, 404);
      }
      res.status(200).json({
        success: true,
        message: "Book retrieved successfully",
        data: book,
      });
    } catch (error) {
      next(error);
    }
  }
);


bookRouter.put(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;
    const updatedBookData = req.body;
    try {
      const book = await Book.findByIdAndUpdate(bookId, updatedBookData, {
        new: true,
        runValidators:true, 
      });
      if (!book) {
        return sendError(res, "Book not found", null, 404);
      }
      await book?.updateBookAvailability();
      res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data: book,
      });
    } catch (error) {
      next(error);
    }
  }
);


bookRouter.delete(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;
    try {
      const book = await Book.findByIdAndDelete(bookId);

      if (!book) {
        return sendError(res, "Book not found", null, 404);
      }

      res.status(200).json({
        success: true,
        message: "Book deleted successfully",
        data: book,
      });
    } catch (error) {
      next(error);
    }
  }
);
