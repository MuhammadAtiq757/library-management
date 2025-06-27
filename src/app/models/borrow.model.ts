import mongoose, { Schema } from "mongoose";
import { IBorrow } from "../interfaces/borrow.interface";
import { Book } from "./book.model";

const borrowSchema = new Schema<IBorrow>(
  {
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    quantity: { type: Number, required: true, min: [1, "Quantity must be a positive number and greater than 0"] },
    dueDate: { type: Date, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

borrowSchema.post("save", async function (doc){
    const book = await Book.findById(doc.book);
    if(book){
        book.copies -= doc.quantity;
        if(book.copies < 0) throw new Error("Not enough copies");
        await book.updateBookAvailability();
    }
})


export const Borrow = mongoose.model<IBorrow>("Borrow", borrowSchema);
