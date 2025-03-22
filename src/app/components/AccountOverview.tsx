"use client";

import type { BankAccount } from "../../types/bank";
import { calculateInterestSinceLastTransaction } from "../utils/interest";

interface AccountOverviewProps {
  account: BankAccount;
}

export default function AccountOverview({ account }: AccountOverviewProps) {
  // Calculate current balance: last transaction's running balance + any accumulated interest
  const { newBalance } = calculateInterestSinceLastTransaction(
    account.transactions,
    0 // Not used anymore since we use running balances
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-500">Account Number</h3>
        <p className="mt-1 text-lg font-semibold">{account.accountNumber}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">Current Balance</h3>
        <p className="mt-1 text-2xl font-bold text-blue-600">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(newBalance)}
        </p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">Interest Rate</h3>
        <p className="mt-1 text-lg font-semibold">{account.interestRate}%</p>
      </div>
      {account.transactions.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500">
            Last Transaction
          </h3>
          <p className="mt-1 text-lg">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              signDisplay: "always",
            }).format(
              account.transactions[0].type === "withdrawal"
                ? -account.transactions[0].amount
                : account.transactions[0].amount
            )}
          </p>
          {/* Use precomputed formattedTimestamp */}
          <p className="text-sm text-gray-500">
            {account.transactions[0].formattedTimestamp}
          </p>
        </div>
      )}
    </div>
  );
}
