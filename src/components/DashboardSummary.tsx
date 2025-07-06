"use client";
import { useEffect, useState } from "react";
import { ReceiptText, TrendingDown } from "lucide-react";

export default function DashboardSummary({ refresh }: { refresh: boolean }) {
  const [total, setTotal] = useState(0);
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/transactions");
      const txs = await res.json();
      setTotal(txs.reduce((acc: number, tx: any) => acc + tx.amount, 0));
      setRecent(txs.slice(0, 3)); // ✅ Show only top 3
    }
    fetchData();
  }, [refresh]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 py-6">
      {/* Total Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md flex items-center gap-4">
        <ReceiptText className="w-10 h-10" />
        <div>
          <h3 className="text-sm uppercase tracking-wide font-medium">Total Expenses</h3>
          <p className="text-3xl font-bold mt-1">₹{total}</p>
        </div>
      </div>

      {/* Recent Transactions Card */}
      <div className="bg-white col-span-2 p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown className="text-rose-500" />
          <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
        </div>

        {recent.length === 0 ? (
          <p className="text-gray-500 text-sm">No recent transactions</p>
        ) : (
          <ul className="divide-y divide-gray-100 text-sm">
            {recent.map((tx) => (
              <li
                key={tx._id}
                className="flex justify-between items-center py-2 text-gray-700"
              >
                <div>
                  <p className="font-medium">{tx.description}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(tx.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{tx.amount}</p>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {tx.category}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
