export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
}

export interface BankAccount {
  id: string;
  name: string;
  accountNumber: string;
  balance: number;
  interestRate: number;
  transactions: Transaction[];
}

export interface UserBankData {
  accounts: BankAccount[];
  selectedAccountId: string;
} 