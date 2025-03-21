import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import CognitoProvider from 'next-auth/providers/cognito';
import { Transaction } from '@/types/bank';

// In a real app, you'd use a database here.
// For this example, we'll use in-memory objects.
// REMEMBER: This is not production-ready!
interface BankState {
  transactions: Transaction[];
}

let bankData: { [userId: string]: BankState } = {};

const ANNUAL_INTEREST_RATE = 0.025; // 2.5% annual interest rate

function calculateAccumulatedInterest(
  prevTransaction: Transaction | null,
  currentTimestamp: string
): number {
  if (!prevTransaction) return 0;

  const daysBetweenTransactions =
    (new Date(currentTimestamp).getTime() -
      new Date(prevTransaction.timestamp).getTime()) /
    (1000 * 60 * 60 * 24);

  return prevTransaction.runningBalance * (ANNUAL_INTEREST_RATE / 365) * daysBetweenTransactions;
}

export async function GET(request: Request) {
    const session = await getServerSession()
    if(!session){
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const userState = bankData[userId] || { transactions: [] };
    return NextResponse.json(userState);
}

export async function POST(request: Request) {
    const session = await getServerSession();
    if(!session){
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    const { userId, type, amount, description } = await request.json();

    if (!userId || !type || !amount) {
        return NextResponse.json(
        { error: 'userId, type, and amount are required' },
        { status: 400 }
        );
    }

    if (amount <= 0 || isNaN(amount)) {
        return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 });
    }

    if (!['deposit', 'withdrawal', 'transfer', 'payment'].includes(type)) {
        return NextResponse.json({ error: 'Invalid transaction type' }, { status: 400 });
    }

    // Initialize user state if it doesn't exist
    if (!bankData[userId]) {
        bankData[userId] = { transactions: [] };
    }

    const prevTransaction = bankData[userId].transactions[0] || null;
    const timestamp = new Date().toISOString();

    // Calculate interest since last transaction
    const accumulatedInterest = calculateAccumulatedInterest(
        prevTransaction,
        timestamp
    );

    // Calculate new running balance
    const transactionAmount = type === 'deposit' ? amount : -amount;
    const prevBalance = prevTransaction?.runningBalance || 0;
    const newRunningBalance = prevBalance + accumulatedInterest + transactionAmount;

    // Create new transaction record
    const newTransaction: Transaction = {
        transactionId: crypto.randomUUID(),
        timestamp,
        type: type === 'transfer' || type === 'payment' ? 'withdrawal' : type,
        amount,
        description: description || type,
        runningBalance: newRunningBalance,
        accumulatedInterest
    };

    // Update bank state
    bankData[userId] = {
        transactions: [newTransaction, ...bankData[userId].transactions]
    };

    return NextResponse.json({
        message: 'Transaction successful',
        transaction: newTransaction
    });
}
