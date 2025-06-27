"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBorrowSummary = exports.borrowBook = void 0;
const book_model_1 = require("../models/book.model");
const borrow_model_1 = require("../models/borrow.model");
const borrowBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { book: bookId, quantity, dueDate } = req.body;
        const book = yield book_model_1.Book.findById(bookId);
        if (!book)
            return res.status(404).json({ success: false, message: 'Book not found', error: {} });
        if (book.copies < quantity) {
            return res.status(400).json({ success: false, message: 'Not enough copies available', error: {} });
        }
        book.copies -= quantity;
        book.checkAvailability();
        yield book.save();
        const borrowRecord = yield new borrow_model_1.Borrow({ book: book._id, quantity, dueDate }).save();
        res.status(201).json({ success: true, message: 'Book borrowed successfully', data: borrowRecord });
    }
    catch (err) {
        next(err);
    }
});
exports.borrowBook = borrowBook;
const getBorrowSummary = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summary = yield borrow_model_1.Borrow.aggregate([
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
    }
    catch (err) {
        next(err);
    }
});
exports.getBorrowSummary = getBorrowSummary;
