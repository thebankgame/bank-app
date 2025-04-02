/**
 * @fileoverview The root layout for the application, including global styles and providers.
 */

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "../components/Providers";

const inter = Inter({ subsets: ["latin"] });

/**
 * Metadata for the application.
 *
 * @type {Metadata}
 */
export const metadata: Metadata = {
  title: "Bank Game",
  description:
    "Learn about banking and compound interest through an interactive game",
};

/**
 * The root layout component for the application.
 *
 * @param {Object} props - The props for the component.
 * @param {React.ReactNode} props.children - The child components to render within the layout.
 * @returns {JSX.Element} The JSX structure for the root layout.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
