'use client'

import { useState, useEffect } from 'react';

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [error, setError] = useState('');
  const userId = 'user1'; // Replace with actual user ID after authentication

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch(`/api/bank?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setBalance(data.balance);
        } else {
          setError('Failed to load balance.');
        }
      } catch (error) {
        setError('An error occurred.');
      }
    };

    fetchBalance();
  }, [userId]);

  const handleDeposit = async () => {
    setError('');
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid deposit amount.');
      return;
    }
    try {
      const response = await fetch('/api/bank', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, type: 'deposit', amount }),
      });

      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance);
        setDepositAmount('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Deposit failed.');
      }
    } catch (error) {
      setError('An error occurred.');
    }
  };

  const handleWithdrawal = async () => {
    setError('');
    const amount = parseFloat(withdrawalAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid withdrawal amount.');
      return;
    }
    try {
      const response = await fetch('/api/bank', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, type: 'withdraw', amount }),
      });
      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance);
        setWithdrawalAmount('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Withdrawal failed.');
      }
    } catch (error) {
      setError('An error occurred.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-sans p-6 sm:p-10">
      <main className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">My Simple Bank</h1>
        <p className="text-xl text-gray-700 mb-8 text-center">
          Current Balance: <span className="font-mono">${balance.toFixed(2)}</span>
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="deposit" className="block text-gray-700 text-sm font-bold mb-2">
            Deposit:
          </label>
          <div className="flex">
            <input
              type="number"
              id="deposit"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Amount"
            />
            <button
              onClick={handleDeposit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2 focus:outline-none focus:shadow-outline"
            >
              Deposit
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="withdrawal" className="block text-gray-700 text-sm font-bold mb-2">
            Withdraw:
          </label>
          <div className="flex">
            <input
              type="number"
              id="withdrawal"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Amount"
            />
            <button
              onClick={handleWithdrawal}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2 focus:outline-none focus:shadow-outline"
            >
              Withdraw
            </button>
          </div>
        </div>
      </main>

      <footer className="mt-10 text-center text-gray-500">
        <p>Built using Next.js</p>
      </footer>
    </div>
  );
}
