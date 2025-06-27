import mongoose, { Model, Schema } from "mongoose";
import { IBook, bookMethods } from "../interfaces/book.interface";

const bookSchema = new Schema<IBook, Model<IBook>, bookMethods>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: [
      "FICTION",
      "NON_FICTION",
      "SCIENCE",
      "HISTORY",
      "BIOGRAPHY",
      "FANTASY",
    ],
    isbn: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    copies: {
      type: Number,
      required: true,
      min: [0, "Copies must be a positive number"],
    },
    available: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// here used instance method to update book availability
bookSchema.method(
  "updateBookAvailability",
 async function () {
    this.available = this.copies > 0 ? true : false;
    await this.save();
  }
);
// here used pre hook to update book availability before saving
bookSchema.pre("save", async function (next){
  this.available = this.copies > 0 ? true : false;
  next();
})

export const Book = mongoose.model("Book", bookSchema);