/**
 * @fileoverview This component wraps the application with the NextAuth session provider.
 */

"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

/**
 * Props for the Providers component.
 *
 * @typedef {Object} ProvidersProps
 * @property {ReactNode} children - The child components to render within the session provider.
 */
interface ProvidersProps {
  children: ReactNode;
}

/**
 * A component that wraps the application with the NextAuth session provider.
 *
 * @param {ProvidersProps} props - The props for the component.
 * @returns {JSX.Element} The JSX structure for the session provider wrapper.
 */
export function Providers({ children }: ProvidersProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
