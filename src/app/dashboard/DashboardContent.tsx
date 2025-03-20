"use client";

import { useState } from "react";
import DashboardCard from "../components/DashboardCard";
import AccountOverview from "../components/AccountOverview";
import TransactionHistory from "../components/TransactionHistory";
import CompoundInterestChart from "../components/CompoundInterestChart";
import InterestRateSimulator from "../components/InterestRateSimulator";
import NewTransactionForm from "../components/NewTransactionForm";
import AccountSelector from "../components/AccountSelector";
import { BankAccount, Transaction, UserBankData } from "@/types/bank";
import { Session } from "next-auth";

interface DashboardContentProps {
  session: Session;
  initialData: UserBankData;
}

function generateAccountNumber(): string {
  return Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
  ).join("-");
}

export default function DashboardContent({
  session,
  initialData,
}: DashboardContentProps) {
  const [accounts, setAccounts] = useState<BankAccount[]>(initialData.accounts);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    initialData.selectedAccountId
  );

  const selectedAccount = accounts.find(
    (account) => account.id === selectedAccountId
  )!;

  const handleNewTransaction = (transaction: {
    description: string;
    amount: number;
    type: "deposit" | "withdrawal";
  }) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
    };

    setAccounts((currentAccounts) =>
      currentAccounts.map((account) => {
        if (account.id === selectedAccountId) {
          const newBalance =
            transaction.type === "deposit"
              ? account.balance + transaction.amount
              : account.balance - transaction.amount;

          return {
            ...account,
            balance: newBalance,
            transactions: [newTransaction, ...account.transactions],
          };
        }
        return account;
      })
    );
  };

  const handleCreateAccount = (name: string) => {
    const newAccount: BankAccount = {
      id: Date.now().toString(),
      name,
      accountNumber: generateAccountNumber(),
      balance: 0,
      interestRate: 2.5, // Default interest rate
      transactions: [],
    };

    setAccounts((current) => [...current, newAccount]);
    setSelectedAccountId(newAccount.id);
  };

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
                src={
                  session.user?.image || "https://www.gravatar.com/avatar/?d=mp"
                }
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
            <h1 className="text-3xl font-semibold text-gray-900">
              Welcome, {session.user?.name || session.user?.email}
            </h1>
            <div className="text-sm text-gray-500">
              Last login: {new Date().toLocaleDateString()}
            </div>
          </div>

          <div className="mb-6">
            <AccountSelector
              accounts={accounts}
              selectedAccountId={selectedAccountId}
              onAccountSelect={setSelectedAccountId}
              onCreateAccount={handleCreateAccount}
            />
          </div>

          <div className="space-y-6">
            {/* Account Overview Section */}
            <DashboardCard
              title={`${selectedAccount.name} (${selectedAccount.accountNumber})`}
              className="mb-6"
            >
              <AccountOverview
                balance={selectedAccount.balance}
                interestRate={selectedAccount.interestRate}
                lastTransaction={selectedAccount.transactions[0]}
              />
            </DashboardCard>

            {/* New Transaction Form */}
            <DashboardCard title="New Transaction" className="mb-6">
              <NewTransactionForm onSubmit={handleNewTransaction} />
            </DashboardCard>

            {/* Growth Projection and Interest Rate Simulator Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Current Growth Projection */}
              <DashboardCard title="Current Growth Projection">
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-4">
                    This chart shows how your current balance of{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(selectedAccount.balance)}{" "}
                    would grow over the next 5 years at your current interest
                    rate of {selectedAccount.interestRate}%.
                  </p>
                  <CompoundInterestChart
                    initialBalance={selectedAccount.balance}
                    interestRate={selectedAccount.interestRate}
                    years={5}
                  />
                </div>
              </DashboardCard>

              {/* Interest Rate Simulator */}
              <DashboardCard title="Interest Rate Simulator">
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Drag the slider to simulate how different interest rates
                    would affect your money's growth over time. The green line
                    marks your current interest rate of{" "}
                    {selectedAccount.interestRate}%.
                  </p>
                  <InterestRateSimulator
                    initialBalance={selectedAccount.balance}
                    currentInterestRate={selectedAccount.interestRate}
                  />
                </div>
              </DashboardCard>
            </div>

            {/* Transaction History */}
            <DashboardCard title="Recent Transactions">
              <TransactionHistory transactions={selectedAccount.transactions} />
            </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  );
}
