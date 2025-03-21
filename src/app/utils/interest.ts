import type { Transaction } from "../types/bank";

export function calculateInterestSinceLastTransaction(
  transactions: Transaction[],
  currentBalance: number
) {
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Get the last transaction and its running balance
  const lastTransaction = sortedTransactions[0];
  if (!lastTransaction) {
    return {
      interestSinceLastTransaction: 0,
      newBalance: 0,
      lastTransactionDate: new Date(),
      today: new Date()
    };
  }

  const today = new Date();
  const lastTransactionDate = new Date(lastTransaction.timestamp);

  // Calculate days between last transaction and today
  const daysSinceLastTransaction = Math.floor(
    (today.getTime() - lastTransactionDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculate interest since last transaction using the stored running balance
  const interestSinceLastTransaction =
    lastTransaction.runningBalance * (0.025 / 365) * daysSinceLastTransaction;

  // New balance is last transaction's running balance plus any new interest
  const newBalance = lastTransaction.runningBalance + interestSinceLastTransaction;

  return {
    interestSinceLastTransaction,
    newBalance,
    lastTransactionDate,
    today,
  };
}