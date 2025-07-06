"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { RefreshCcw, Scale3D } from "lucide-react";

export default function BudgetVsActualChart({ refresh }: { refresh: boolean }) {
  const [chartData, setChartData] = useState([]);

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

      const data = budgets
        .filter((b: any) => b.month === currentMonth)
        .map((b: any) => ({
          category: b.category,
          budget: b.amount,
          spent: categoryTotals[b.category] || 0,
        }));

      setChartData(data);
    }

    fetchData();
  }, [refresh]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full h-[320px]">
      <div className="flex items-center gap-2 mb-4">
        <Scale3D className="text-emerald-600" />
        <h3 className="text-lg font-semibold text-gray-700">
          Budget vs Actual (This Month)
        </h3>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barCategoryGap={20}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="category" className="text-sm" />
          <YAxis className="text-sm" />
          <Tooltip
            formatter={(value: number, name: string) =>
              [`₹${value.toLocaleString()}`, name === "spent" ? "Spent" : "Budget"]
            }
            contentStyle={{ backgroundColor: "white", border: "1px solid #ccc" }}
          />
          <Legend />
          <Bar
            dataKey="budget"
            fill="#34d399"
            radius={[4, 4, 0, 0]}
            name="Budget"
          />
          <Bar
            dataKey="spent"
            fill="#f87171"
            radius={[4, 4, 0, 0]}
            name="Spent"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
