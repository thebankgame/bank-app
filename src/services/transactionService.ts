/**
 * @fileoverview Service functions for managing transactions in user bank accounts.
 */

import { BankAccount, Transaction, UserBankData } from "@/types/bank";

/**
 * Adds a new transaction to a user's bank account.
 *
 * @param {UserBankData} userData - The user's bank data.
 * @param {string} accountId - The ID of the account to which the transaction will be added.
 * @param {string} description - A description of the transaction.
 * @param {number} amount - The amount of the transaction.
 * @param {"deposit" | "withdrawal"} type - The type of the transaction.
 * @returns {UserBankData} The updated user bank data.
 * @throws {Error} If the account is not found.
 */
export const addTransaction = (
  userData: UserBankData,
  accountId: string,
  description: string,
  amount: number,
  type: "deposit" | "withdrawal"
): UserBankData => {
  const updatedUserData = { ...userData };
  const accountIndex = updatedUserData.accounts.findIndex(
    (account) => account.id === accountId
  );

  if (accountIndex === -1) {
    throw new Error("Account not found");
  }

  const account = updatedUserData.accounts[accountIndex];
  const newBalance =
    type === "deposit"
      ? account.balance + amount
      : account.balance - amount;

  // Create new transaction with running balance
  const newTransaction: Transaction = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    description,
    amount,
    type,
    runningBalance: newBalance, // Store the new account balance as the running balance
  };

  // Update account with new transaction and balance
  updatedUserData.accounts[accountIndex] = {
    ...account,
    balance: newBalance,
    transactions: [newTransaction, ...account.transactions],
  };

  return updatedUserData;
};

/**
 * Retrieves the transaction history for a specific bank account.
 *
 * @param {UserBankData} userData - The user's bank data.
 * @param {string} accountId - The ID of the account whose transactions will be retrieved.
 * @returns {Transaction[]} The list of transactions for the specified account.
 * @throws {Error} If the account is not found.
 */
export const getTransactionHistory = (
  userData: UserBankData,
  accountId: string
): Transaction[] => {
  const account = userData.accounts.find((account) => account.id === accountId);
  if (!account) {
    throw new Error("Account not found");
  }
  return account.transactions;
};