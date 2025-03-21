export type Transaction = {
  id: string;
  date: string; // ISO 8601 UTC timestamp
  description: string;
  amount: number;
  type: "deposit" | "withdrawal";
  accumulatedInterest: number;
  runningBalance?: number; // Make runningBalance optional
};

export type BankAccount = {
  id: string;
  name: string;
  accountNumber: string;
  balance: number;
  interestRate: number;
  transactions: Transaction[];
};

export type UserBankData = {
  accounts: BankAccount[];
  selectedAccountId: string;
};

export type LastTransaction = {
  amount: number;
  date: string;
  type: "deposit" | "withdrawal";
}; 