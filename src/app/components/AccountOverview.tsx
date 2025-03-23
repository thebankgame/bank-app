"use client";

import { useState } from "react";
import { createNewTransaction } from "@/lib/actions";
import { BankAccount, Transaction } from "@/types/bank";
import { Session } from "next-auth";
import { calculateInterestSinceLastTransaction } from "../utils/interest";
import router from "next/router";

interface AccountOverviewProps {
  session: Session;
  account: BankAccount;
  balance: number;
  onInterestRateChange: (newRate: number) => void;
  onCreateNewTransaction: (newTransaction: Transaction) => void;
}

export default function AccountOverview({
  session,
  account,
  balance,
  onInterestRateChange,
  onCreateNewTransaction: onTransactionsChange,
}: AccountOverviewProps) {
  const [isRateChanging, setIsRateChanging] = useState(false);
  const [inputRate, setInputRate] = useState(account?.interestRate) || 0;
  const [currentRate, setCurrentRate] = useState(account?.interestRate) || 0;

  const handleRateChange = async () => {
    console.log("handling rate change to:", inputRate);
    if (!account) {
      console.error("No account selected");
      return;
    }

    if (inputRate === undefined) {
      console.error("No inputRate provided");
      return;
    }

    if (inputRate === account.interestRate) {
      console.log("Rate unchanged");
      setIsRateChanging(false);
      return;
    }

    // const lastTransaction =
    //   account.transactions[account.transactions.length - 1];
    const accumulatedInterest = calculateInterestSinceLastTransaction(
      account.interestRate,
      account.transactions
    );

    const transaction: Omit<
        Transaction,
        "transactionId" | "timestamp" | "runningBalance" | "accumulatedInterest"
      > = {
      type: "deposit",
      amount: 0,
      description: `Interest Rate changed from ${account?.interestRate.toFixed(
        1
      )}% to ${inputRate?.toFixed(1)}%`,
    };

    const newTransaction = await createNewTransaction(
      session,
      account,
      transaction
    );

    if (!newTransaction) {
      console.error("Unable to create new transaction");
      return;
    }
    onTransactionsChange(newTransaction);

    console.log("about to update interest rate to", inputRate);

    if (inputRate !== undefined) {
      console.log("Updating interest rate to", inputRate);
      handleInterestRateChange(inputRate);
    }

    setCurrentRate(inputRate);
    setIsRateChanging(false);
  };

  const handleInterestRateChange = async (newRate: number) => {
    try {
      const response = await fetch(
        `/api/accounts/${account.accountId}/interestRate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.idToken}`,
          },
          body: JSON.stringify({ interestRate: Number(newRate) }),
        }
      );

      if (response.status === 401) {
        // Token expired, redirect to sign in
        router.push("/");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to update interest rate");
      }

      onInterestRateChange(newRate);
    } catch (error) {
      console.error("Error updating interst rate:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-green-100 rounded-lg shadow-md p-4">
        <h3 className="text-sm font-medium text-green-800 mb-1">
          Current Balance
        </h3>
        <p className="text-2xl font-bold text-green-900">
          ${(balance ?? 0).toFixed(2)}
        </p>
      </div>
      <div className="bg-purple-100 rounded-lg shadow-md p-4">
        <h3 className="text-sm font-medium text-purple-800 mb-1">
          Interest Rate
        </h3>
        <p className="text-2xl font-bold text-purple-900">
          {currentRate.toFixed(1)}%
        </p>
        {isRateChanging ? (
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder={account.interestRate.toFixed(1)}
              step="0.1"
              min="0"
              max="100"
              value={inputRate}
              onChange={(e) => setInputRate(Number(e.target.value))}
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
      <div className="bg-orange-100 rounded-lg shadow-md p-4">
        <h3 className="text-sm font-medium text-orange-800 mb-1">
          Last Transaction
          {account.transactions.length > 0 && (
            <span className="font-normal text-orange-700">
              {" "}
              (
              {new Date(
                account.transactions[account.transactions.length - 1].timestamp
              ).toLocaleDateString()}
              )
            </span>
          )}
        </h3>
        <p className="text-2xl font-bold text-orange-900">
          {account.transactions.length > 0 ? (
            <span
              className={
                account.transactions[account.transactions.length - 1].type ===
                "deposit"
                  ? "text-green-700"
                  : "text-red-700"
              }
            >
              {account.transactions[account.transactions.length - 1].type ===
              "deposit"
                ? "+"
                : "-"}
              $
              {account.transactions[
                account.transactions.length - 1
              ].amount.toFixed(2)}
            </span>
          ) : (
            "No transactions"
          )}
        </p>
      </div>
    </div>
  );
}
