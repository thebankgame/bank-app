"use client";

import { useState, useEffect } from "react";
import DashboardCard from "../components/DashboardCard";
import AccountOverview from "../components/AccountOverview";
import TransactionHistory from "../components/TransactionHistory";
import CompoundInterestChart from "../components/CompoundInterestChart";
import InterestRateSimulator from "../components/InterestRateSimulator";
import NewTransactionForm from "../components/NewTransactionForm";
import AccountSelector from "../components/AccountSelector";
import type { BankAccount, UserBankData } from "../../types/bank";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

interface DashboardContentProps {
  session: Session;
  initialData: UserBankData;
}

// Create a client component for the error UI
function ErrorDisplay({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <div className="p-8 max-w-xl mx-auto">
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export default function DashboardContent({
  session,
  initialData,
}: DashboardContentProps) {
  const router = useRouter();
  const [accounts, setAccounts] = useState<BankAccount[]>(initialData.accounts);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    initialData.selectedAccountId
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedAccount = accounts.find(
    (account) => account.accountId === selectedAccountId
  );

  const refreshAccounts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/accounts", {
        headers: {
          Authorization: `Bearer ${session.idToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        // Token expired, redirect to sign in
        router.push("/api/auth/signin");
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch accounts: ${response.statusText}`);
      }

      const data: BankAccount[] = await response.json();
      setAccounts(data);
      if (data.length > 0 && !selectedAccountId) {
        setSelectedAccountId(data[0].accountId);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load accounts"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAccounts();
  }, [session.idToken]);

  const handleNewTransaction = async (transaction: {
    type: "deposit" | "withdrawal";
    amount: number;
    description: string;
  }) => {
    if (!selectedAccount) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/accounts/${selectedAccount.accountId}/transactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.idToken}`,
          },
          body: JSON.stringify(transaction),
        }
      );

      if (response.status === 401) {
        // Token expired, redirect to sign in
        router.push("/api/auth/signin");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to create transaction");
      }

      await refreshAccounts();
    } catch (error) {
      console.error("Error creating transaction:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create transaction"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async (name: string) => {
    try {
      const response = await fetch("/api/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error("Failed to create account");

      const newAccount: BankAccount = await response.json();
      setAccounts((current) => [...current, newAccount]);
      setSelectedAccountId(newAccount.accountId);
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  if (error) {
    return <ErrorDisplay error={error} onRetry={refreshAccounts} />;
  }

  if (isLoading && accounts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to Your Bank
          </h1>
          <div className="text-sm text-gray-600">
            {session.user?.name || session.user?.email}
          </div>
        </div>
        <div className="flex items-center gap-4 mb-6">
          <select
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            className="text-lg text-gray-700 bg-transparent border-none focus:ring-0 p-0"
          >
            {accounts.map((account) => (
              <option key={account.accountId} value={account.accountId}>
                {account.name} • {account.accountNumber}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              const name = prompt("Enter account name:");
              if (name) handleCreateAccount(name);
            }}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + New Account
          </button>
        </div>

        {selectedAccount && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-green-100 rounded-lg shadow-md p-4">
                <h3 className="text-sm font-medium text-green-800 mb-1">
                  Current Balance
                </h3>
                <p className="text-2xl font-bold text-green-900">
                  ${selectedAccount.balance.toFixed(2)}
                </p>
              </div>
              <div className="bg-purple-100 rounded-lg shadow-md p-4">
                <h3 className="text-sm font-medium text-purple-800 mb-1">
                  Interest Rate
                </h3>
                <p className="text-2xl font-bold text-purple-900">
                  {selectedAccount.interestRate}%
                </p>
              </div>
              <div className="bg-orange-100 rounded-lg shadow-md p-4">
                <h3 className="text-sm font-medium text-orange-800 mb-1">
                  Last Transaction
                  {selectedAccount.transactions.length > 0 && (
                    <span className="font-normal text-orange-700">
                      {" "}
                      (
                      {new Date(
                        selectedAccount.transactions[
                          selectedAccount.transactions.length - 1
                        ].timestamp
                      ).toLocaleDateString()}
                      )
                    </span>
                  )}
                </h3>
                <p className="text-2xl font-bold text-orange-900">
                  {selectedAccount.transactions.length > 0 ? (
                    <span
                      className={
                        selectedAccount.transactions[
                          selectedAccount.transactions.length - 1
                        ].type === "deposit"
                          ? "text-green-700"
                          : "text-red-700"
                      }
                    >
                      {selectedAccount.transactions[
                        selectedAccount.transactions.length - 1
                      ].type === "deposit"
                        ? "+"
                        : "-"}
                      $
                      {selectedAccount.transactions[
                        selectedAccount.transactions.length - 1
                      ].amount.toFixed(2)}
                    </span>
                  ) : (
                    "No transactions"
                  )}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <DashboardCard title="New Transaction">
                <NewTransactionForm
                  onSubmit={handleNewTransaction}
                  isLoading={isLoading}
                />
              </DashboardCard>
            </div>
          </>
        )}

        {selectedAccount ? (
          <div className="space-y-8">
            <DashboardCard title="Transaction History">
              <TransactionHistory
                transactions={selectedAccount.transactions}
                currentBalance={selectedAccount.balance}
              />
            </DashboardCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DashboardCard title="Interest Projection">
                <div className="h-[300px]">
                  <CompoundInterestChart
                    balance={selectedAccount.balance}
                    interestRate={selectedAccount.interestRate}
                  />
                </div>
              </DashboardCard>
              <DashboardCard title="Interest Rate Simulator">
                <InterestRateSimulator
                  initialBalance={selectedAccount.balance}
                  initialRate={selectedAccount.interestRate}
                />
              </DashboardCard>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Account Selected
              </h3>
              <p className="text-gray-500">
                Please select an account from the dropdown above to view its
                details.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
