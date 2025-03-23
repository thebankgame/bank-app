import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { addTransaction, getAccount } from "../../../services/dynamoDBService";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const accountId = url.pathname.split("/").slice(-2, -1)[0]; // Extract accountId from the URL

  if (!accountId) {
    return new NextResponse("Account ID is required", { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !session.idToken) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { type, amount, timestamp, description } = await request.json();

    if (!type || amount === undefined || !description) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const account = await getAccount(accountId);
    if (!account) {
      return new NextResponse("Account not found", { status: 404 });
    }

    let transactionTimestamp = new Date().toISOString();

    if (timestamp) {
      transactionTimestamp = timestamp;
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
    console.error("Error in POST:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
