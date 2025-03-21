import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { getAccounts, createAccount } from "../services/dynamoDBService";
import { headers } from "next/headers";

function generateAccountNumber(): string {
  return Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
  ).join("-");
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.idToken) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const accounts = await getAccounts(session.user.id, session.idToken);
    return NextResponse.json(accounts);
  } catch (error) {
    console.error("Error fetching/creating accounts:", error);
    
    // Check if the error is a token expiration error
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      return new NextResponse("Token expired", { status: 401 });
    }
    
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.idToken) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name } = await request.json();
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const newAccount = await createAccount(session.user.id, name, session.idToken);
    return NextResponse.json(newAccount);
  } catch (error) {
    console.error("Error creating account:", error);
    
    // Check if the error is a token expiration error
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      return new NextResponse("Token expired", { status: 401 });
    }
    
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 