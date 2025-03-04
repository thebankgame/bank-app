import { NextResponse } from 'next/server';

// In a real app, you'd use a database here.
// For this example, we'll use an in-memory object.
// REMEMBER: This is not production-ready!
let bankData: { [userId: string]: number } = {};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  const balance = bankData[userId] || 0;
  return NextResponse.json({ balance });
}

export async function POST(request: Request) {
  const { userId, type, amount } = await request.json();

  if (!userId || !type || !amount) {
    return NextResponse.json(
      { error: 'userId, type, and amount are required' },
      { status: 400 }
    );
  }

  if (amount <= 0 || isNaN(amount)) {
     return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 });
  }

  if (!['deposit', 'withdraw'].includes(type)) {
    return NextResponse.json({ error: 'Invalid transaction type' }, { status: 400 });
  }

  let currentBalance = bankData[userId] || 0;

  if (type === 'deposit') {
    currentBalance += amount;
  } else if (type === 'withdraw') {
    if (currentBalance < amount) {
      return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 });
    }
    currentBalance -= amount;
  }

  bankData[userId] = currentBalance;

  return NextResponse.json({ message: 'Transaction successful', balance: currentBalance });
}
