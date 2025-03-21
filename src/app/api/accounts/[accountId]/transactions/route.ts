import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { addTransaction, getAccount } from "../../../services/dynamoDBService";

export async function POST(
  request: Request,
  context: { params: { accountId: string } }
) {
  const { accountId } = await context.params;
  if (!accountId) {
    return new NextResponse("Account ID is required", { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.idToken) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { type, amount, description } = await request.json();
    if (!type || amount === undefined || !description) {
      return new NextResponse("Missing required fields", { status: 400 });
    }
    
    // Verify the account belongs to the user
    const account = await getAccount(session.user.id, accountId, session.idToken);
    if (!account) {
      return new NextResponse("Account not found", { status: 404 });
    }

    // Calculate accumulated interest since last transaction
    const lastTransaction = account.transactions[account.transactions.length - 1];
    const lastTransactionTime = lastTransaction ? new Date(lastTransaction.timestamp) : new Date(account.createdAt);
    const currentTime = new Date();
    const daysSinceLastTransaction = (currentTime.getTime() - lastTransactionTime.getTime()) / (1000 * 60 * 60 * 24);
    const accumulatedInterest = account.balance * (0.025 / 365) * daysSinceLastTransaction;

    // Add interest to the balance before applying the new transaction
    const balanceWithInterest = account.balance + accumulatedInterest;

    // Create the new transaction with the updated balance
    const transaction = await addTransaction(
      session.user.id,
      accountId,
      {
        description,
        amount,
        type,
      },
      session.idToken
    );

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 