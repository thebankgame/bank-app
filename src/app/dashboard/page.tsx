import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';
import DashboardContent from './DashboardContent';

// This would come from your database in a real application
const mockData = {
  accountNumber: '1234-5678-9012-3456',
  balance: 25000.75,
  interestRate: 2.5,
  lastTransaction: {
    amount: 1500.00,
    date: '2025-03-13',
    type: 'deposit' as const,
  },
  transactions: [
    {
      id: '1',
      date: '2025-03-13',
      description: 'Salary Deposit',
      amount: 1500.00,
      type: 'deposit' as const,
    },
    {
      id: '2',
      date: '2025-03-12',
      description: 'Grocery Shopping',
      amount: 85.50,
      type: 'withdrawal' as const,
    },
    {
      id: '3',
      date: '2025-03-10',
      description: 'Interest Credit',
      amount: 12.75,
      type: 'deposit' as const,
    },
  ],
};

// Server component
export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return <DashboardContent session={session} initialData={mockData} />;
}