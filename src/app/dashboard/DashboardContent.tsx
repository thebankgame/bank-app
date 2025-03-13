'use client';

import DashboardCard from '../components/DashboardCard';
import AccountOverview from '../components/AccountOverview';
import TransactionHistory from '../components/TransactionHistory';
import CompoundInterestChart from '../components/CompoundInterestChart';
import { BankAccount } from '@/types/bank';
import { Session } from 'next-auth';

interface DashboardContentProps {
  session: Session;
  initialData: BankAccount;
}

export default function DashboardContent({ session, initialData }: DashboardContentProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-blue-600">Bank Game</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-500">{session.user?.email}</span>
              <img 
                src={session.user?.image || 'https://www.gravatar.com/avatar/?d=mp'} 
                alt="Profile" 
                className="h-8 w-8 rounded-full"
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">Welcome, {session.user?.name}</h1>
            <div className="text-sm text-gray-500">
              Last login: {new Date().toLocaleDateString()}
            </div>
          </div>

          <div className="space-y-6">
            {/* Account Overview Section */}
            <DashboardCard title="Account Overview" className="mb-6">
              <AccountOverview
                accountNumber={initialData.accountNumber}
                balance={initialData.balance}
                interestRate={initialData.interestRate}
                lastTransaction={initialData.lastTransaction}
              />
            </DashboardCard>

            {/* Compound Interest Chart */}
            <DashboardCard title="Growth Projection" className="mb-6">
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  This chart shows how your current balance of {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(initialData.balance)} would grow over the next 5 years at {initialData.interestRate}% annual interest rate, assuming no additional deposits or withdrawals.
                </p>
                <CompoundInterestChart
                  initialBalance={initialData.balance}
                  interestRate={initialData.interestRate}
                  years={5}
                />
              </div>
            </DashboardCard>

            {/* Transaction History */}
            <DashboardCard title="Recent Transactions">
              <TransactionHistory transactions={initialData.transactions} />
            </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  );
}
