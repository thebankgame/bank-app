import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import DashboardContent from "./DashboardContent";
import { BankAccount, UserBankData } from "@/types/bank";
import { getAccounts } from "../api/services/dynamoDBService";
import SignOutButton from "../components/SignOutButton";

function generateAccountNumber(): string {
  return Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
  ).join("-");
}

// This would come from your database in a real application
const createInitialData = (): UserBankData => {
  const initialAccountId = Date.now().toString();
  const initialAccount: BankAccount = {
    userId: "",
    accountId: initialAccountId,
    name: "Playground",
    accountNumber: generateAccountNumber(),
    balance: 0,
    interestRate: 2.5,
    transactions: [],
    createdAt: new Date().toISOString(),
  };

  return {
    accounts: [initialAccount],
    selectedAccountId: initialAccountId,
  };
};

// Server component
export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Debug logging
  console.log(
    "Dashboard Page - Session data:",
    JSON.stringify(
      {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        hasIdToken: !!session?.idToken,
        email: session?.user?.email,
        timestamp: new Date().toISOString(),
      },
      null,
      2
    )
  );

  if (!session?.user?.id) {
    console.error("No user ID in session");
    redirect("/auth/signin");
  }

  try {
    // Get initial data for the dashboard
    const accounts = await getAccounts();

    const initialData: UserBankData = {
      accounts,
      selectedAccountId: accounts[0]?.accountId || "",
    };

    return <DashboardContent session={session} initialData={initialData} />;
  } catch (error) {
    console.error("Error fetching initial dashboard data:", error);

    // If token is expired or invalid, show sign out button
    if (error instanceof Error && error.name === "TokenExpiredError") {
      return (
        <div className="p-4">
          <h1 className="text-xl font-bold mb-4">Session Expired</h1>
          <p className="text-red-600 mb-4">
            Your session has expired. Please sign in again.
          </p>
          <SignOutButton />
        </div>
      );
    }

    // For other errors, show error UI
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Error Loading Dashboard</h1>
        <p className="text-red-600">
          There was an error loading your dashboard data. Please try refreshing
          the page.
        </p>
        <a
          href="/dashboard"
          className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh Page
        </a>
      </div>
    );
  }
}
