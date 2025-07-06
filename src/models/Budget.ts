import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  month: { type: String, required: true }, // "2025-07"
});

export default mongoose.models.Budget || mongoose.model("Budget", BudgetSchema);
