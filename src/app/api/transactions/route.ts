// src/app/api/transactions/route.ts
import { connectToDatabase } from "@/lib/db";
import Transaction from "@/models/Transaction";

export async function GET() {
  await connectToDatabase();
  const transactions = await Transaction.find().sort({ date: -1 });
  return Response.json(transactions);
}

export async function POST(req: Request) {
  const data = await req.json();
  await connectToDatabase();
  const transaction = await Transaction.create(data);
  return Response.json(transaction);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await connectToDatabase();
  await Transaction.findByIdAndDelete(id);
  return Response.json({ success: true });
}
