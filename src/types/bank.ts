export interface Transaction {
  transactionId: string;
  description: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  timestamp: string;
  runningBalance: number;
}

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

export interface UserBankData {
  accounts: BankAccount[];
  selectedAccountId: string;
}

export type LastTransaction = {
  amount: number;
  date: string;
  type: "deposit" | "withdrawal";
}; 