import { BankAccount, Transaction, UserBankData } from "@/types/bank";

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