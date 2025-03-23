import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { addTransaction, getAccount } from "../../../services/dynamoDBService";
import { time } from "console";

export async function POST(request: Request, context: any) {
  // console.log('Context params:', context.params);
  const params = await context.params;
  const accountId = params.accountId;
  if (!accountId) {
    return new NextResponse("Account ID is required", { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.idToken) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let transactionTimestamp = new Date().toISOString();

    const { type, amount, timestamp, description } = await request.json();

    if (!type || amount === undefined || !description) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    if (timestamp) {
      transactionTimestamp = timestamp;
    }

    // Verify the account belongs to the user
    const account = await getAccount(accountId);
    if (!account) {
      return new NextResponse("Account not found", { status: 404 });
    }

    // Add the new transaction
    const updatedAccount = await addTransaction(
      accountId,
      {
        type,
        amount,
        description,
      },
      transactionTimestamp
    );

    return NextResponse.json(updatedAccount);
  } catch (error) {
    console.error("Error creating transaction:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
