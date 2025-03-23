/**
 * @fileoverview This API route handles operations related to bank accounts,
 * including retrieving and creating accounts for the authenticated user.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { getAccounts, createAccount, TokenExpiredError } from "../services/dynamoDBService";

/**
 * Handles GET requests to retrieve all bank accounts for the authenticated user.
 *
 * @async
 * @returns {Promise<Response>} The response containing the user's accounts.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accounts = await getAccounts();
    return NextResponse.json(accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    if (error instanceof TokenExpiredError) {
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Handles POST requests to create a new bank account for the authenticated user.
 *
 * @async
 * @param {Request} req - The incoming request object.
 * @returns {Promise<Response>} The response containing the created account.
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const account = await createAccount(name);
    return NextResponse.json(account);
  } catch (error) {
    console.error("Error creating account:", error);
    if (error instanceof TokenExpiredError) {
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}