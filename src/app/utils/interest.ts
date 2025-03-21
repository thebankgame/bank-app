import type { Transaction } from "../types/bank";

export function calculateInterestSinceLastTransaction(
  transactions: Transaction[],
  currentBalance: number
) {
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Calculate running balances for all transactions
  const runningBalances = sortedTransactions.reduce(
    (acc, transaction, index) => {
      const prevBalance = index === 0 ? 0 : acc[index - 1];
      const amount =
        transaction.type === "deposit" ? transaction.amount : -transaction.amount;
      acc[index] = prevBalance + amount;
      return acc;
    },
    [] as number[]
  );

  // Calculate accumulated interest for all transactions
  const accumulatedInterest = sortedTransactions.reduce(
    (acc, transaction, index) => {
      if (index === 0) return [0];
      const prevTransaction = sortedTransactions[index - 1];
      const daysBetweenTransactions =
        (new Date(transaction.timestamp).getTime() -
          new Date(prevTransaction.timestamp).getTime()) /
        (1000 * 60 * 60 * 24);
      const prevBalance = runningBalances[index - 1];
      acc[index] =
        acc[index - 1] + prevBalance * (0.025 / 365) * daysBetweenTransactions;
      return acc;
    },
    [] as number[]
  );

  // Calculate interest since last transaction
  const lastTransaction = sortedTransactions[0];
  const lastBalance = runningBalances[0];
  const lastAccumulatedInterest = accumulatedInterest[0];
  const today = new Date();
  const lastTransactionDate = new Date(lastTransaction?.timestamp || today);

  // Calculate days between last transaction and today
  const daysSinceLastTransaction = Math.floor(
    (today.getTime() - lastTransactionDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculate interest since last transaction
  const interestSinceLastTransaction =
    lastBalance * (0.025 / 365) * daysSinceLastTransaction;
  const newBalance = lastBalance + lastAccumulatedInterest + interestSinceLastTransaction;

  return {
    interestSinceLastTransaction,
    newBalance,
    lastTransactionDate,
    today,
  };
} 