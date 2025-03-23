/**
 * @fileoverview This component provides a form for creating new transactions
 * (deposits or withdrawals) for a specific bank account.
 */

"use client";

import { useState } from "react";
import type { Transaction } from "../../types/bank";
import { createNewTransaction } from "@/lib/actions";
import { BankAccount } from "@/types/bank";
import { Session } from "next-auth";

/**
 * Props for the NewTransactionForm component.
 *
 * @typedef {Object} NewTransactionFormProps
 * @property {Session} session - The current user's session.
 * @property {BankAccount} account - The bank account for which the transaction is being created.
 * @property {(transaction: Transaction) => void} onCreateNewTransaction - Callback to handle the creation of a new transaction.
 */
interface NewTransactionFormProps {
  session: Session;
  account: BankAccount;
  onCreateNewTransaction: (transaction: Transaction) => void;
}

/**
 * A form component for creating new transactions (deposits or withdrawals).
 *
 * @param {NewTransactionFormProps} props - The props for the component.
 * @returns {JSX.Element} The JSX structure for the new transaction form.
 */
export default function NewTransactionForm({
  session,
  account,
  onCreateNewTransaction: onSubmit,
}: NewTransactionFormProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"deposit" | "withdrawal">("withdrawal");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles the form submission to create a new transaction.
   *
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && description.trim()) {
      const transaction = {
        type,
        amount: numericAmount,
        timestamp: new Date().toISOString(),
        description: description.trim(),
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

      onSubmit(newTransaction);
      // Reset form
      setDescription("");
      setAmount("");
      setType("withdrawal");

      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
            placeholder="Enter transaction description"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Amount
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-700 font-medium">$</span>
            </div>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Transaction Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) =>
              setType(e.target.value as "deposit" | "withdrawal")
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          >
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
          </select>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Add Transaction"}
        </button>
      </div>
    </form>
  );
}
