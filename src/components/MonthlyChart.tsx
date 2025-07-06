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
} from "recharts";
import { CalendarDays } from "lucide-react";

export default function MonthlyChart({ refresh }: { refresh: boolean }) {
  const [data, setData] = useState<{ month: string; amount: number }[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/transactions");
      const txs = await res.json();
      const monthly = Array(12).fill(0);

      txs.forEach((tx: any) => {
        const month = new Date(tx.date).getMonth();
        monthly[month] += tx.amount;
      });

      setData(
        monthly.map((val, idx) => ({
          month: new Date(0, idx).toLocaleString("default", { month: "short" }),
          amount: val,
        }))
      );
    }
    fetchData();
  }, [refresh]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-700">Monthly Expenses</h3>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" className="text-sm" />
          <YAxis className="text-sm" />
          <Tooltip
            contentStyle={{ backgroundColor: "white", border: "1px solid #ddd" }}
            formatter={(value: number) => `₹${value.toLocaleString()}`}
          />
          <Bar
            dataKey="amount"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            barSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
