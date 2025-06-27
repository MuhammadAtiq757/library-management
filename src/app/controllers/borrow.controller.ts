// src/controllers/borrow.controller.ts
import { Request, Response, NextFunction } from 'express';
import { Book } from '../models/book.model';
import { Borrow } from '../models/borrow.model';



export const borrowBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { book: bookId, quantity, dueDate } = req.body;
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found', error: {} });
    if (book.copies < quantity) {
      return res.status(400).json({ success: false, message: 'Not enough copies available', error: {} });
    }
    book.copies -= quantity;
    book.checkAvailability();
    await book.save();

    const borrowRecord = await new Borrow({ book: book._id, quantity, dueDate }).save();
    res.status(201).json({ success: true, message: 'Book borrowed successfully', data: borrowRecord });
  } catch (err) {
    next(err);
  }
};

export const getBorrowSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const summary = await Borrow.aggregate([
      { $group: { _id: '$book', totalQuantity: { $sum: '$quantity' } } },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'bookDetails'
        }
      },
      { $unwind: '$bookDetails' },
      {
        $project: {
          book: { title: '$bookDetails.title', isbn: '$bookDetails.isbn' },
          totalQuantity: 1
        }
      }
    ]);
    res.json({ success: true, message: 'Borrowed books summary retrieved successfully', data: summary });
  } catch (err) {
    next(err);
  }
}; 