import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { addTransaction, getAccount } from "../../../services/dynamoDBService";

export async function POST(
  request: Request,
  { params }: { params: { accountId: string } }
) {
  const accountId = params.accountId;
  if (!accountId) {
    return new NextResponse("Account ID is required", { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.idToken) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { description, amount, type } = await request.json();
    if (!description || amount === undefined || !type) {
      return new NextResponse("Missing required fields", { status: 400 });
    }
    
    // Verify the account belongs to the user
    const account = await getAccount(session.user.id, accountId, session.idToken);
    if (!account) {
      return new NextResponse("Account not found", { status: 404 });
    }

    const updatedAccount = await addTransaction(
      session.user.id,
      accountId,
      {
        description,
        amount,
        type,
      },
      session.idToken
    );

    return NextResponse.json(updatedAccount);
  } catch (error) {
    console.error("Error adding transaction:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 