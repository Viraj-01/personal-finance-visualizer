// src/components/TransactionList.tsx
"use client";
import { useEffect, useState } from "react";

export default function TransactionList({ refresh }: { refresh: boolean }) {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data);
    }
    fetchData();
  }, [refresh]);

  async function handleDelete(id: string) {
    await fetch("/api/transactions", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    setTransactions((prev) => prev.filter((t) => t._id !== id));
  }

  if (!transactions.length) return <p className="p-4 text-gray-500">No transactions yet.</p>;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800">Transaction History</h2>
    <ul className="space-y-2 p-4">
      {transactions.map((tx) => (
        <li key={tx._id} className="flex justify-between items-center border p-2 rounded">
          <p className="text-sm text-blue-500">{tx.category}</p>
          <div>
            <p className="font-medium">{tx.description}</p>
            <p className="text-sm text-gray-500">{new Date(tx.date).toDateString()}</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="font-bold">₹{tx.amount}</p>
            <button
              onClick={() => handleDelete(tx._id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
    </div>
  );
}
