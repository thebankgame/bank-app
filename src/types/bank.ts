/**
 * @fileoverview Type definitions for bank-related entities, including transactions, accounts, and user data.
 */

/**
 * Represents a single transaction in a bank account.
 *
 * @typedef {Object} Transaction
 * @property {string} transactionId - The unique ID of the transaction.
 * @property {"deposit" | "withdrawal"} type - The type of the transaction.
 * @property {number} amount - The amount of the transaction.
 * @property {string} description - A description of the transaction.
 * @property {string} timestamp - The timestamp of the transaction.
 * @property {number} runningBalance - The running balance after the transaction.
 * @property {number} accumulatedInterest - The interest accumulated up to this transaction.
 */
export interface Transaction {
  transactionId: string;
  type: "deposit" | "withdrawal";
  amount: number;
  description: string;
  timestamp: string;
  runningBalance: number;
  accumulatedInterest: number;
}

/**
 * Represents a bank account.
 *
 * @typedef {Object} BankAccount
 * @property {string} userId - The ID of the user who owns the account.
 * @property {string} accountId - The unique ID of the account.
 * @property {string} name - The name of the account.
 * @property {string} accountNumber - The account number.
 * @property {number} balance - The current balance of the account.
 * @property {number} interestRate - The annual interest rate for the account.
 * @property {Transaction[]} transactions - The list of transactions for the account.
 * @property {string} createdAt - The timestamp when the account was created.
 */
export interface BankAccount {
  userId: string;
  accountId: string;
  name: string;
  accountNumber: string;
  balance: number;
  interestRate: number;
  transactions: Transaction[];
  createdAt: string;
}

/**
 * Represents the user's bank data, including accounts and the selected account ID.
 *
 * @typedef {Object} UserBankData
 * @property {BankAccount[]} accounts - The list of the user's bank accounts.
 * @property {string} selectedAccountId - The ID of the currently selected account.
 */
export interface UserBankData {
  accounts: BankAccount[];
  selectedAccountId: string;
}

/**
 * Represents the last transaction details.
 *
 * @typedef {Object} LastTransaction
 * @property {number} amount - The amount of the last transaction.
 * @property {string} date - The date of the last transaction.
 * @property {"deposit" | "withdrawal"} type - The type of the last transaction.
 */
export type LastTransaction = {
  amount: number;
  date: string;
  type: "deposit" | "withdrawal";
};