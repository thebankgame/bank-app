'use client';

import { LastTransaction } from '@/types/bank';

interface AccountOverviewProps {
  accountNumber: string;
  balance: number;
  interestRate: number;
  lastTransaction?: LastTransaction;
}

export default function AccountOverview({ accountNumber, balance, interestRate, lastTransaction }: AccountOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <h3 className="text-sm font-medium opacity-80">Account Number</h3>
        <p className="text-2xl font-semibold mt-2">{accountNumber}</p>
      </div>
      
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
        <h3 className="text-sm font-medium opacity-80">Current Balance</h3>
        <p className="text-2xl font-semibold mt-2">{formatCurrency(balance)}</p>
      </div>
      
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
        <h3 className="text-sm font-medium opacity-80">Interest Rate</h3>
        <p className="text-2xl font-semibold mt-2">{interestRate}%</p>
      </div>
      
      {lastTransaction && (
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <h3 className="text-sm font-medium opacity-80">Last Transaction</h3>
          <p className="text-2xl font-semibold mt-2">
            {lastTransaction.type === 'deposit' ? '+' : '-'} {formatCurrency(lastTransaction.amount)}
          </p>
          <p className="text-sm opacity-80 mt-1">{new Date(lastTransaction.date).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
}
