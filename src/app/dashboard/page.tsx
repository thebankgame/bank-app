/**
 * @fileoverview The main dashboard page for the application. It fetches user data and displays the dashboard content.
 */

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import DashboardContent from "./DashboardContent";
import { UserBankData } from "@/types/bank";
import { getAccounts } from "../api/services/dynamoDBService";
import SignOutButton from "../../components/SignOutButton";

/**
 * The main dashboard page component.
 *
 * @async
 * @returns {Promise<JSX.Element>} The JSX structure for the dashboard page.
 */
export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    console.error("No user email in session: ", session);
    redirect("/");
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
