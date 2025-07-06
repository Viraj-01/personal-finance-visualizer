// src/models/Transaction.ts
import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  amount: Number,
  description: String,
  date: Date,
  category: {
    type: String,
    enum: ["Food", "Rent", "Travel", "Shopping", "Bills", "Other"],
    default: "Other",
  },
});


export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
