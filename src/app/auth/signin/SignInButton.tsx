/**
 * @fileoverview This component renders a button for signing in with a specific
 * authentication provider using NextAuth.
 */

"use client";

import { signIn } from "next-auth/react";

/**
 * Props for the SignInButton component.
 *
 * @typedef {Object} SignInButtonProps
 * @property {string} providerId - The ID of the authentication provider.
 * @property {string} providerName - The name of the authentication provider.
 */
interface SignInButtonProps {
  providerId: string;
  providerName: string;
}

/**
 * A button component for signing in with a specific authentication provider.
 *
 * @param {SignInButtonProps} props - The props for the component.
 * @returns {JSX.Element} The JSX structure for the sign-in button.
 */
export default function SignInButton({ providerId }: SignInButtonProps) {
  return (
    <button
      onClick={() => signIn(providerId, { callbackUrl: "/dashboard" })}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded"
    >
      Sign Up / In to Get Started!
    </button>
  );
}
