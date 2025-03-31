/**
 * @fileoverview This file defines the main landing page of the application.
 * It checks the user's authentication status and redirects them to the dashboard
 * if they are already signed in. Otherwise, it displays a welcome message and
 * sign-in options using NextAuth providers.
 */

import { getProviders } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import SignInButton from "./auth/signin/SignInButton";
import OpenAI from "openai";
import AIForm from "./components/AIForm";

/**
 * The main component for the application's landing page.
 *
 * @async
 * @function Home
 * @returns {JSX.Element} The JSX structure for the landing page.
 */
export default async function Home() {
  // Fetch the current user's session
  const session = await getServerSession(authOptions);

  // Redirect to the dashboard if the user is already signed in
  if (session) {
    redirect("/dashboard");
  }

  // Fetch the available authentication providers
  const providers = await getProviders();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <div className="bg-white p-12 rounded-lg shadow-lg max-w-3xl">
        <h1 className="text-5xl font-bold text-center text-blue-700 mb-8">
          Run Your Own Bank
        </h1>
        <p className="text-xl font-bold text-gray-700 mb-6 text-center">
          Teach your kids how compound interest makes money grow!
        </p>
        <p className="text-lg text-gray-700 mb-6">
          Traditional banks offer interest rates on savings accounts, but the
          balance in children&apos;s accounts are typically so small that
          interest income doesn&apos;t add up to much. Earning $3 for an entire
          year after depositing a $100 birthday check from grandma isn&apos;t
          very motivating or instructive.
        </p>
        <p className="text-lg text-gray-700 mb-6">
          This app is a virtual bank AND interactive teaching tool designed for
          families like yours. Use it to create multiple accounts, set your own
          interest rates, track deposit and withdrawal history and visualize how
          compound interest increases savings over time.
        </p>
        <p className="text-lg text-gray-700 mb-6">
          Inspired by the book{" "}
          <a
            href="https://www.amazon.com/First-National-Bank-Dad-Foolproof/dp/1416534253"
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            The First National Bank of Dad
          </a>
          , the best way to teach kids the value of compound interest on small
          balances is to set a meaningfully high interest rate in the app and
          watch the interest income grow on a kid-friendly timeline.
        </p>
        <div className="flex justify-center mt-8">
          <div className="flex justify-center mt-8">
            {providers &&
              Object.values(providers).map((provider) => (
                /**
                 * Render a sign-in button for each authentication provider.
                 *
                 * @param {Object} provider - The authentication provider object.
                 * @param {string} provider.name - The name of the provider.
                 * @param {string} provider.id - The unique ID of the provider.
                 */
                <SignInButton
                  key={provider.name}
                  providerId={provider.id}
                  providerName={provider.name}
                />
              ))}
          </div>
        </div>

        <br />
        <br />
        <br />
        <p className="text-lg text-gray-700 mb-6">PLAYGROUND</p>
        <AIForm />
      </div>
    </main>
  );
}
