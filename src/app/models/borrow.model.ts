// src/models/borrow.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IBorrow } from '../interfaces/borrow.interface';

const BorrowSchema: Schema<IBorrow> = new Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  quantity: { type: Number, required: true, min: [1, 'Quantity must be a positive number'] },
  dueDate: { type: Date, required: true },
}, { timestamps: true });

export const Borrow = mongoose.model<IBorrow>('Borrow', BorrowSchema);