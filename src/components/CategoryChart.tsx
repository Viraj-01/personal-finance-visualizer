"use client";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#f87171", "#a78bfa", "#38bdf8"];

export default function CategoryChart({ refresh }: { refresh: boolean }) {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/transactions");
      const txs = await res.json();
      const categoryMap: Record<string, number> = {};

      txs.forEach((tx: { category: string; amount: number }) => {
        categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
      });

      const chartData = Object.keys(categoryMap).map((cat) => ({
        name: cat,
        value: categoryMap[cat],
      }));

      setData(chartData);
    }
    fetchData();
  }, [refresh]);

  return (
    <div className="h-64 w-full p-4">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
