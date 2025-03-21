"use client";

import { Transaction } from "@/types/bank";

interface TransactionHistoryProps {
  transactions: Transaction[];
}

type TransactionWithRunningBalance = Transaction & {
  runningBalance?: number;
};

export default function TransactionHistory({
  transactions,
}: TransactionHistoryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
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
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date & Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Balance
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => {
            const txn = transaction as TransactionWithRunningBalance;
            return (
              <tr key={txn.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateTime(txn.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {txn.description}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                    txn.type === "deposit" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {txn.type === "deposit" ? "+" : "-"}{" "}
                  {formatCurrency(Math.abs(txn.amount))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                  {txn.runningBalance !== undefined
                    ? formatCurrency(txn.runningBalance)
                    : "Unavailable"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
