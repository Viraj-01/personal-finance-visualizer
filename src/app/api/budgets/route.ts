import { connectToDatabase } from "@/lib/db";
import Budget from "@/models/Budget";

export async function GET() {
  await connectToDatabase();
  const budgets = await Budget.find();
  return Response.json(budgets);
}

export async function POST(req: Request) {
  const data = await req.json();
  await connectToDatabase();
  const budget = await Budget.findOneAndUpdate(
    { category: data.category, month: data.month },
    { $set: { amount: data.amount } },
    { upsert: true, new: true }
  );
  return Response.json(budget);
}
