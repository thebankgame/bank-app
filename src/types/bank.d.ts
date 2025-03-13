export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
}

export interface LastTransaction {
  amount: number;
  date: string;
  type: 'deposit' | 'withdrawal';
}

export interface BankAccount {
  accountNumber: string;
  balance: number;
  interestRate: number;
  lastTransaction: LastTransaction;
  transactions: Transaction[];
}

export type BankActionType = 'transfer' | 'deposit' | 'withdraw' | 'pay';
