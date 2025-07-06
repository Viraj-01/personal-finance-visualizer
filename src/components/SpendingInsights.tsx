"use client";
import { useEffect, useState } from "react";
import { AlertTriangle, Hourglass, CheckCircle } from "lucide-react";

type Insight = {
  category: string;
  status: "over" | "near" | "under";
  message: string;
  spent: number;
  budget: number;
};

export default function SpendingInsights({ refresh }: { refresh: boolean }) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const resTx = await fetch("/api/transactions");
      const txs = await resTx.json();

      const resBudgets = await fetch("/api/budgets");
      const budgets = await resBudgets.json();

      const currentMonth = new Date().toISOString().slice(0, 7);
      const categoryTotals: Record<string, number> = {};

      txs.forEach((tx: any) => {
        const txMonth = new Date(tx.date).toISOString().slice(0, 7);
        if (txMonth === currentMonth) {
          categoryTotals[tx.category] =
            (categoryTotals[tx.category] || 0) + tx.amount;
        }
      });

      const results: Insight[] = budgets.map((b: any) => {
        const spent = categoryTotals[b.category] || 0;
        const remaining = b.amount - spent;

        let status: Insight["status"];
        if (spent > b.amount) {
          status = "over";
        } else if (remaining <= 200) {
          status = "near";
        } else {
          status = "under";
        }

        const message =
          status === "over"
            ? `Over budget in ${b.category} by ₹${spent - b.amount}`
            : status === "near"
            ? `Almost at budget in ${b.category} (₹${remaining} left)`
            : `You're doing great in ${b.category} (₹${remaining} remaining)`;

        return {
          category: b.category,
          status,
          message,
          spent,
          budget: b.amount,
        };
      });

      setInsights(results);
      setLoading(false);
    }

    fetchData();
  }, [refresh]);

  if (loading) return null;

  return (
    <div className="bg-yellow-50 dark:bg-gray-800 border border-yellow-300 dark:border-yellow-500 rounded-lg p-6 mb-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="text-yellow-600 dark:text-yellow-400" />
        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
          Spending Insights
        </h3>
      </div>

      <ul className="space-y-4 text-sm">
        {insights.map((insight, i) => {
          const { spent, budget, status, message } = insight;
          const percent = Math.min((spent / budget) * 100, 100).toFixed(1);

          let icon;
          let bgColor = "";
          let barColor = "";

          if (status === "over") {
            icon = <AlertTriangle className="w-4 h-4 text-red-600" />;
            bgColor = "bg-red-100 dark:bg-red-800 border-red-300 dark:border-red-500";
            barColor = "bg-red-500";
          } else if (status === "near") {
            icon = <Hourglass className="w-4 h-4 text-yellow-500" />;
            bgColor = "bg-yellow-100 dark:bg-yellow-800 border-yellow-300 dark:border-yellow-600";
            barColor = "bg-yellow-400";
          } else {
            icon = <CheckCircle className="w-4 h-4 text-green-600" />;
            bgColor = "bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-600";
            barColor = "bg-green-500";
          }

          return (
            <li
              key={i}
              className={`p-3 border rounded ${bgColor}`}
            >
              <div className="flex items-center gap-2 mb-1 text-gray-800 dark:text-gray-100">
                {icon}
                <span>{message}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded transition-all ">
                <div
                  className={`h-3 rounded ${barColor}  transition-all duration-700`}
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <p className="text-xs text-right text-gray-600 dark:text-gray-300 mt-1">
                ₹{spent} spent of ₹{budget} ({percent}%)
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
