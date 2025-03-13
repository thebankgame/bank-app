'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { BankActionType } from '@/types/bank';

interface QuickActionsProps {
  onSuccess?: () => void;
}

export default function QuickActions({ onSuccess }: QuickActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<BankActionType>('deposit');
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleActionClick = (type: BankActionType) => {
    setActionType(type);
    setAmount('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    
    if (!isNaN(numAmount) && numAmount > 0) {
      setIsLoading(true);
      try {
        const response = await fetch('/api/bank/actions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: actionType,
            amount: numAmount,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to process transaction');
        }

        toast.success('Transaction completed successfully!');
        setIsModalOpen(false);
        setAmount('');
        onSuccess?.();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to process transaction');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getActionTitle = (type: BankActionType) => {
    switch (type) {
      case 'transfer': return 'Transfer Money';
      case 'deposit': return 'Deposit';
      case 'withdraw': return 'Withdraw';
      case 'pay': return 'Pay Bills';
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          onClick={() => handleActionClick('transfer')}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
        >
          Transfer Money
        </button>
        <button 
          onClick={() => handleActionClick('deposit')}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
        >
          Deposit
        </button>
        <button 
          onClick={() => handleActionClick('withdraw')}
          className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-colors"
        >
          Withdraw
        </button>
        <button 
          onClick={() => handleActionClick('pay')}
          className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors"
        >
          Pay Bills
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {getActionTitle(actionType)}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="amount"
                    step="0.01"
                    min="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md flex items-center ${
                    isLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Confirm'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
