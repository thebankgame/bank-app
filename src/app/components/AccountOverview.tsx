"use client";

import type { BankAccount, Transaction } from "../../types/bank";
import { useState } from "react";
import { calculateInterestSinceLastTransaction } from "../utils/interest";

interface AccountOverviewProps {
  account: BankAccount;
}

export default function AccountOverview({ account }: AccountOverviewProps) {
  const { newBalance } = calculateInterestSinceLastTransaction(
    account.transactions
  );

  const [showSlider, setShowSlider] = useState(false); // State to toggle slider visibility
  const [isRateChanging, setIsRateChanging] = useState(false);
  const [newRate, setNewRate] = useState(account.interestRate);

  function calculateAccumulatedInterest(
  prevTransaction: Transaction | null,
  interestRate: number
): number {
  if (!prevTransaction) return 0;

  const daysBetweenTransactions =
    (new Date().getTime() -
      new Date(prevTransaction.timestamp).getTime()) /
    (1000 * 60 * 60 * 24);

  return prevTransaction.runningBalance * (interestRate / 365) * daysBetweenTransactions;
}


  const handleRateChange = () => {
    if (newRate === account.interestRate) {
      setIsRateChanging(false);
    }

    const lastTransaction =
      account.transactions[account.transactions.length - 1];
    const accumulatedInterest = calculateAccumulatedInterest(
      lastTransaction,
      account.interestRate
    );


    const newTransaction = {
      date: new Date().toISOString(),
      description: `Interest Rate changed from ${account.interestRate.toFixed(
        2
      )}% to ${newRate.toFixed(2)}%`,
      amount: 0,
      interest: accumulatedInterest,
      runningBalance:
        (lastTransaction?.runningBalance || 0) + accumulatedInterest,
    };


    //TODO: commit this to the data store
    account.interestRate = newRate;
  };

  const toggleSlider = () => {
    setShowSlider((prev) => !prev);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-500">Account Number</h3>
        <p className="mt-1 text-lg font-semibold">{account.accountNumber}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">Interest Rate</h3>
        <div className="flex items-center gap-4">
          <p className="text-lg font-semibold">
            {account.interestRate.toFixed(2)}%
          </p>
          {isRateChanging ? (
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="{newRate}"
                step="0.1"
                min="0"
                max="100"
                value={newRate}
                onChange={(e) => setNewRate(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
              <button
                onClick={handleRateChange}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                Change
              </button>
              <button
                onClick={() => setIsRateChanging(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsRateChanging(true)}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              Change
            </button>
          )}{" "}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">Current Balance</h3>
        <p className="mt-1 text-lg font-semibold">${newBalance.toFixed(2)}</p>
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
