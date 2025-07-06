"use client";

import { useState } from "react";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import MonthlyChart from "@/components/MonthlyChart";
import CategoryChart from "@/components/CategoryChart";
import DashboardSummary from "@/components/DashboardSummary";
import BudgetForm from "@/components/BudgetForm";
import BudgetVsActualChart from "@/components/BudgetVsActualChart";
import SpendingInsights from "@/components/SpendingInsights";
import { LineChart, PlusCircle, ClipboardList, Wallet } from "lucide-react";

export default function Home() {
  const [refresh, setRefresh] = useState(false);

  return (
    <main className="max-w-6xl mx-auto py-8 px-4 space-y-10 bg-white min-h-screen">
      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-800">
          Personal Finance Visualizer
        </h1>
        <p className="text-gray-600 text-sm">Track your expenses, budgets, and insights with ease</p>
      </header>

      {/* Overview Summary */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-gray-700 mb-2">
          <LineChart className="text-blue-500" />
          <h2 className="text-xl font-semibold">Overview</h2>
        </div>
        <DashboardSummary refresh={refresh}/>
        <SpendingInsights refresh={refresh}/>
      </section>

      {/* Add Transaction */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-gray-700 mb-2">
          <PlusCircle className="text-green-600" />
          <h2 className="text-xl font-semibold">Add Transaction</h2>
        </div>
        <TransactionForm refresh={() => setRefresh(!refresh)} />
      </section>

      {/* Charts Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-gray-700 mb-2">
          <LineChart className="text-purple-600" />
          <h2 className="text-xl font-semibold">Analytics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MonthlyChart refresh={refresh}/>
          <CategoryChart refresh={refresh} />
        </div>
      </section>

      {/* Transaction History */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-gray-700 mb-2">
          <ClipboardList className="text-gray-600" />
          <h2 className="text-xl font-semibold">Transaction History</h2>
        </div>
        <TransactionList refresh={refresh} />
      </section>

      {/* Budget Tools */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-gray-700 mb-2">
          <Wallet className="text-emerald-600" />
          <h2 className="text-xl font-semibold">Budget Planning</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BudgetForm refresh={refresh} />
          <BudgetVsActualChart refresh={refresh} />
        </div>
      </section>
    </main>
  );
}
