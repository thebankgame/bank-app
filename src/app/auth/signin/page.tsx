import { getProviders } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import SignInButton from './SignInButton';

export default async function SignIn() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect('/dashboard');
  }

  const providers = await getProviders();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <div className="bg-white p-12 rounded-lg shadow-lg max-w-3xl">
        <h1 className="text-5xl font-bold text-center text-blue-700 mb-8">
          Sign In to The Bank Game
        </h1>
        <div className="flex justify-center mt-8">
          {providers &&
            Object.values(providers).map((provider) => (
              <SignInButton
                key={provider.name}
                providerId={provider.id}
                providerName={provider.name}
              />
            ))}
        </div>
      </div>
    </main>
  );
}
