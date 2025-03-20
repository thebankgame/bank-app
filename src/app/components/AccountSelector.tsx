"use client";

import { useState } from "react";
import { BankAccount } from "@/types/bank";

interface AccountSelectorProps {
  accounts: BankAccount[];
  selectedAccountId: string;
  onAccountSelect: (accountId: string) => void;
  onCreateAccount: (name: string) => void;
}

export default function AccountSelector({
  accounts,
  selectedAccountId,
  onAccountSelect,
  onCreateAccount,
}: AccountSelectorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAccountName.trim()) {
      onCreateAccount(newAccountName.trim());
      setNewAccountName("");
      setIsCreating(false);
    }
  };

  return (
    <div className="relative">
      {!isCreating ? (
        <div className="flex space-x-2">
          <select
            value={selectedAccountId}
            onChange={(e) => onAccountSelect(e.target.value)}
            className="block w-64 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white text-gray-900 font-medium"
          >
            {accounts.map((account) => (
              <option
                key={account.id}
                value={account.id}
                className="text-gray-900 font-medium"
              >
                {account.name} ({account.accountNumber})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Account
          </button>
        </div>
      ) : (
        <form onSubmit={handleCreateSubmit} className="flex space-x-2">
          <input
            type="text"
            value={newAccountName}
            onChange={(e) => setNewAccountName(e.target.value)}
            placeholder="Enter account name"
            className="block w-64 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white text-gray-900 font-medium placeholder-gray-400"
            autoFocus
          />
          <button
            type="submit"
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => setIsCreating(false)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
