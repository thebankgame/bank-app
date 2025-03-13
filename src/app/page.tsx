// src/app/page.tsx

import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard'); // Redirect to dashboard if user is already signed in
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <div className="bg-white p-12 rounded-lg shadow-lg max-w-3xl">
        <h1 className="text-5xl font-bold text-center text-blue-700 mb-8">
          Welcome to The Bank Game
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Unlock the secrets of saving and watch your wealth grow! The Bank Game is designed to help you understand the power of saving, especially the magic of compound interest.
        </p>
        <p className="text-lg text-gray-700 mb-6">
          In this interactive application, you'll get to run your own virtual bank.  Manage accounts, track savings, and see first-hand how consistent saving habits lead to significant growth over time.  
        </p>
        <div className="text-lg text-gray-700 mb-6">
          <p>Learn the fundamentals of:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Saving strategies</li>
            <li>Compound interest</li>
            <li>Managing a Bank</li>
            <li>And more!</li>
          </ul>
        </div>
        <div className="flex justify-center mt-8">
          <Link href="/auth/signin" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded">
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
