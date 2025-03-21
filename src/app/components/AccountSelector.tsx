"use client";

import type { BankAccount } from "../../types/bank";
import { useState } from "react";

interface AccountSelectorProps {
  accounts: BankAccount[];
  selectedAccountId: string;
  onSelectAccount: (accountId: string) => void;
  onCreateAccount: (name: string) => void;
}

export default function AccountSelector({
  accounts,
  selectedAccountId,
  onSelectAccount,
  onCreateAccount,
}: AccountSelectorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");

  const handleCreateAccount = () => {
    if (newAccountName.trim()) {
      onCreateAccount(newAccountName.trim());
      setNewAccountName("");
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex-1 min-w-[200px]">
        <select
          value={selectedAccountId}
          onChange={(e) => onSelectAccount(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
        >
          {accounts.map((account) => (
            <option
              key={account.accountId}
              value={account.accountId}
              className="text-gray-900 bg-white"
            >
              {account.name} ({account.accountNumber})
            </option>
          ))}
        </select>
      </div>

      {isCreating ? (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={newAccountName}
            onChange={(e) => setNewAccountName(e.target.value)}
            placeholder="Account Name"
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
          />
          <button
            onClick={handleCreateAccount}
            disabled={!newAccountName.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create
          </button>
          <button
            onClick={() => setIsCreating(false)}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 text-blue-600 hover:text-blue-700 focus:outline-none"
        >
          + New Account
        </button>
      )}
    </div>
  );
}
