/**
 * @fileoverview This component displays a table of transaction history for a bank account.
 * It includes details such as the date, description, amount, interest, and balance for each transaction.
 */

"use client";

import { useState, useEffect } from "react";
import type { Transaction } from "../../types/bank";
import { calculateInterestSinceLastTransaction } from "../utils/interest";

/**
 * Props for the TransactionHistory component.
 *
 * @typedef {Object} TransactionHistoryProps
 * @property {number} interestRate - The annual interest rate for the account.
 * @property {Transaction[]} transactions - The list of transactions for the account.
 */
interface TransactionHistoryProps {
  interestRate: number;
  transactions: Transaction[];
}

/**
 * A component that displays a table of transaction history for a bank account.
 *
 * @param {TransactionHistoryProps} props - The props for the component.
 * @returns {JSX.Element} The JSX structure for the transaction history table.
 */
export default function TransactionHistory({
  interestRate,
  transactions,
}: TransactionHistoryProps) {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Precompute the current date to avoid hydration mismatch
    const now = new Date().toISOString();
    setCurrentDate(
      new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZoneName: "short",
      }).format(new Date(now))
    );
  }, []);

  /**
   * Formats a number as currency.
   *
   * @param {number | undefined | null} amount - The amount to format.
   * @returns {string} The formatted currency string.
   */
  const formatCurrency = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        signDisplay: "never",
      }).format(0);
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      signDisplay: "always",
    }).format(amount);
  };

  /**
   * Formats an ISO date string into a human-readable date and time.
   *
   * @param {string} isoString - The ISO date string to format.
   * @returns {string} The formatted date and time string.
   */
  const formatDateTime = (isoString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZoneName: "short",
    }).format(new Date(isoString));
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

            // Calculate interest since last transaction using shared function
            const { interestSinceLastTransaction } =
              calculateInterestSinceLastTransaction(
                interestRate,
                sortedTransactions
              );

            // Calculate new balance including latest interest
            const latestBalance =
              (sortedTransactions[0]?.runningBalance || 0) +
              (interestSinceLastTransaction || 0);

            return (
              <>
                {/* Row for accumulated interest since last transaction */}
                <tr className="bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {currentDate || "Loading..."}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Accumulated interest
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <span className="text-green-600">
                      {formatCurrency(interestSinceLastTransaction)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                    {formatCurrency(interestSinceLastTransaction)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                    {formatCurrency(latestBalance)}
                  </td>
                </tr>

                {/* Transaction rows */}
                {sortedTransactions.map((transaction) => (
                  <tr key={transaction.transactionId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(transaction.timestamp)}
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
                        {formatCurrency(
                          transaction.type === "deposit"
                            ? transaction.amount
                            : -transaction.amount
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                      {formatCurrency(transaction.accumulatedInterest)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                      {formatCurrency(transaction.runningBalance)}
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
