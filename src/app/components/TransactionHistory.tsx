"use client";

import type { Transaction } from "../../types/bank";
import { calculateInterestSinceLastTransaction } from "../utils/interest";

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
          {(() => {
            const sortedTransactions = [...transactions].sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
            );

            // Calculate running balances for all transactions
            const runningBalances = sortedTransactions.reduce(
              (acc, transaction, index) => {
                const prevBalance = index === 0 ? 0 : acc[index - 1];
                const amount =
                  transaction.type === "deposit"
                    ? transaction.amount
                    : -transaction.amount;
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
                  acc[index - 1] +
                  prevBalance * (0.025 / 365) * daysBetweenTransactions;
                return acc;
              },
              [] as number[]
            );

            // Calculate interest since last transaction using shared function
            const {
              interestSinceLastTransaction,
              newBalance,
              today,
            } = calculateInterestSinceLastTransaction(transactions, currentBalance);

            return (
              <>
                {/* Row for accumulated interest since last transaction */}
                <tr className="bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {today.toLocaleString(undefined, {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Accumulated interest
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <span className="text-green-600">
                      +${interestSinceLastTransaction.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                    {interestSinceLastTransaction > 0
                      ? `+$${interestSinceLastTransaction.toFixed(2)}`
                      : "$0.00"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                    ${newBalance.toFixed(2)}
                  </td>
                </tr>

                {/* Existing transaction rows */}
                {sortedTransactions.map((transaction, index) => (
                  <tr key={transaction.transactionId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.timestamp).toLocaleString(
                        undefined,
                        {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )}
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
                      {accumulatedInterest[index] > 0
                        ? `+$${accumulatedInterest[index].toFixed(2)}`
                        : "$0.00"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                      $
                      {(
                        runningBalances[index] + accumulatedInterest[index]
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </>
            );
          })()}
        </tbody>
      </table>
    </div>
  );
}
