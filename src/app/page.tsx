// src/app/page.tsx

import { getProviders } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import SignInButton from "./auth/signin/SignInButton";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard"); // Redirect to dashboard if user is already signed in
  }

  const providers = await getProviders();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <div className="bg-white p-12 rounded-lg shadow-lg max-w-3xl">
        <h1 className="text-5xl font-bold text-center text-blue-700 mb-8">
          Get Ready to Run Your Own Bank
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Teach your kids about compound interest and help them watch their
          money grow! Inspired by the book{" "}
          <a
            href="https://www.amazon.com/First-National-Bank-Dad-Foolproof/dp/1416534253"
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            The First National Bank of Dad
          </a>
          , this app will let you run your own bank, with you controlling the
          interest rate and adjusting as they learn.
        </p>
        <p className="text-lg text-gray-700 mb-6">
          Kids aren't incentivized to save when a bank pays them only $3 to not spend Grandma's $100 birthday check for an entire year (which feels like an eternity to a child!). Now, you can run your own bank for your kids, showing them the value of compounding interest by paying them $3 each week they save, or each month, or whatever is appropriate for their age and understanding. 
        </p>
        <p className="text-lg text-gray-700 mb-6">
          In this interactive application, you'll get to run your own virtual
          bank. You'll manage multiple accounts, track transactions, and
          work with your kids to model how money would grow with different interest rates.
        </p>
        {/* <div className="text-lg text-gray-700 mb-6">
          <p>Learn the fundamentals of:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Saving strategies</li>
            <li>Compound interest</li>
            <li>Managing a Bank</li>
            <li>And more!</li>
          </ul>
        </div> */}
        <div className="flex justify-center mt-8">
          {/* <div className="bg-white p-12 rounded-lg shadow-lg max-w-3xl"> */}
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
          {/* </div> */}
        </div>
      </div>
    </main>
  );
}
