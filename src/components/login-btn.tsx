/**
 * @fileoverview This component renders a button for signing in or out using NextAuth.
 * It displays the user's email if they are signed in.
 */

"use client";

import { useSession, signIn, signOut } from "next-auth/react";

/**
 * A component that renders a button for signing in or out using NextAuth.
 * Displays the user's email if they are signed in.
 *
 * @returns {JSX.Element} The JSX structure for the login button.
 */
export default function Component() {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
