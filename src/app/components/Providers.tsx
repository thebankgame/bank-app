/**
 * @fileoverview This component wraps the application with necessary providers,
 * such as the Toaster for displaying notifications.
 */

"use client";

import { Toaster } from "react-hot-toast";

/**
 * Props for the Providers component.
 *
 * @typedef {Object} ProvidersProps
 * @property {React.ReactNode} children - The child components to render within the providers.
 */
interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * A component that wraps the application with necessary providers.
 *
 * @param {ProvidersProps} props - The props for the component.
 * @returns {JSX.Element} The JSX structure for the providers wrapper.
 */
export default function Providers({ children }: ProvidersProps) {
  return (
    <>
      {children}
      <Toaster position="top-right" />
    </>
  );
}
