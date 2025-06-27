import mongoose, { Schema, Document } from 'mongoose';
import { IBook } from '../interfaces/book.interface';


const BookSchema: Schema<IBook> = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: {
    type: String,
    enum: ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'],
    required: true,
  },
  isbn: { type: String, required: true, unique: true },
  description: { type: String },
  copies: { type: Number, required: true, min: [0, 'Copies must be a positive number'] },
  available: { type: Boolean, default: true },
}, { timestamps: true });

BookSchema.methods.checkAvailability = function () {
  this.available = this.copies > 0;
};

BookSchema.pre('save', function (next) {
  this.checkAvailability();
  next();
})

export const Book = mongoose.model<IBook>('Book', BookSchema);