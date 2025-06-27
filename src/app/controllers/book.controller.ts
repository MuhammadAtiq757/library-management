// src/controllers/book.controller.ts
import { Request, Response, NextFunction } from 'express';
import { Book } from '../models/book.model';


export const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = new Book(req.body);
    const saved = await book.save();
    res.status(201).json({ success: true, message: 'Book created successfully', data: saved });
  } catch (err) {
    next(err);
  }
};

export const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { filter, sortBy = 'createdAt', sort = 'desc', limit = 10 } = req.query as any;
    const query: any = filter ? { genre: filter } : {};
    const books = await Book.find(query).sort({ [sortBy]: sort === 'asc' ? 1 : -1 }).limit(Number(limit));
    res.json({ success: true, message: 'Books retrieved successfully', data: books });
  } catch (err) {
    next(err);
  }
};

export const getBookById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found', error: {} });
    res.json({ success: true, message: 'Book retrieved successfully', data: book });
  } catch (err) {
    next(err);
  }
};

export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await Book.findByIdAndUpdate(req.params.bookId, req.body, { new: true, runValidators: true });
    res.json({ success: true, message: 'Book updated successfully', data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Book.findByIdAndDelete(req.params.bookId);
    res.json({ success: true, message: 'Book deleted successfully', data: null });
  } catch (err) {
    next(err);
  }
};