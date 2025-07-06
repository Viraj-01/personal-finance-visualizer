"use client";
import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";

const categories = ["Food", "Rent", "Travel", "Shopping", "Bills", "Other"];

export default function BudgetForm({ refresh }: { refresh: boolean }) {
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [currentMonth, setCurrentMonth] = useState<string | null>(null);

  // Safely calculate current month on client
  useEffect(() => {
    const now = new Date().toISOString().slice(0, 7); // yyyy-mm
    setCurrentMonth(now);
  }, [refresh]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || !currentMonth) return alert("Enter all fields");

    await fetch("/api/budgets", {
      method: "POST",
      body: JSON.stringify({
        category,
        amount: Number(amount),
        month: currentMonth,
      }),
    });

    setAmount("");
    // onUpdate();
  }

  if (!currentMonth) return null; // or return a skeleton/loader

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="text-green-600" />
        <h3 className="text-lg font-semibold text-gray-800">Set Monthly Budget</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Budget Amount (₹)
          </label>
          <input
            type="number"
            placeholder="e.g., 5000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-all"
        >
          Save Budget
        </button>
      </form>
    </div>
  );
}
