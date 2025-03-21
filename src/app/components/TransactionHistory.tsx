"use client";

import type { Transaction } from "../../types/bank";

interface TransactionHistoryProps {
  transactions: Transaction[];
  currentBalance: number;
}

type TransactionWithRunningBalance = Transaction & {
  runningBalance?: number;
  accumulatedInterest: number;
};

export default function TransactionHistory({
  transactions,
  currentBalance,
}: TransactionHistoryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      signDisplay: "always",
    }).format(amount);
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    // Format in user's local timezone
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZoneName: "short", // Shows timezone abbreviation (e.g., EST, PST)
    }).format(date);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Interest
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Balance
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction, index) => {
            const runningBalance = transactions
              .slice(0, index + 1)
              .reduce((acc, t) => {
                const amount = t.type === "deposit" ? t.amount : -t.amount;
                return acc + amount;
              }, 0);

            const accumulatedInterest = transactions
              .slice(0, index + 1)
              .reduce((acc, t, i) => {
                if (i === 0) return 0; // No interest on first transaction
                const prevTransaction = transactions[i - 1];
                const daysBetweenTransactions =
                  (new Date(t.timestamp).getTime() -
                    new Date(prevTransaction.timestamp).getTime()) /
                  (1000 * 60 * 60 * 24);
                const prevBalance = transactions
                  .slice(0, i)
                  .reduce((acc, t) => {
                    const amount = t.type === "deposit" ? t.amount : -t.amount;
                    return acc + amount;
                  }, 0);
                return (
                  acc + prevBalance * (0.025 / 365) * daysBetweenTransactions
                );
              }, 0);

            return (
              <tr key={transaction.transactionId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(transaction.timestamp).toLocaleString(undefined, {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <span
                    className={
                      transaction.type === "deposit"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {transaction.type === "deposit" ? "+" : "-"}$
                    {transaction.amount.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                  {accumulatedInterest > 0
                    ? `+$${accumulatedInterest.toFixed(2)}`
                    : "$0.00"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                  ${(runningBalance + accumulatedInterest).toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
