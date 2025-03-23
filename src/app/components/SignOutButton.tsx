/**
 * @fileoverview This component renders a button for signing out the user using NextAuth.
 */

"use client";

import { signOut } from "next-auth/react";

/**
 * A button component for signing out the user.
 *
 * @returns {JSX.Element} The JSX structure for the sign-out button.
 */
export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/api/sso/logout" })}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
    >
      Sign Out
    </button>
  );
}
