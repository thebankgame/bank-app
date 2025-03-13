'use client';

import { signIn } from 'next-auth/react';

interface SignInButtonProps {
  providerId: string;
  providerName: string;
}

export default function SignInButton({ providerId, providerName }: SignInButtonProps) {
  return (
    <button
      onClick={() => signIn(providerId, { callbackUrl: '/dashboard' })}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded"
    >
      Sign in with {providerName}
    </button>
  );
}
