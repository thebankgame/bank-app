import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import DashboardContent from "./DashboardContent";
import { BankAccount, UserBankData } from "@/types/bank";

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
    id: initialAccountId,
    name: "Family Account",
    accountNumber: generateAccountNumber(),
    balance: 0,
    interestRate: 2.5,
    transactions: [],
  };

  return {
    accounts: [initialAccount],
    selectedAccountId: initialAccountId,
  };
};

// Server component
export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  // In a real application, you would fetch the user's accounts from the database
  // For now, we'll use mock data
  const userData = createInitialData();

  return <DashboardContent session={session} initialData={userData} />;
}
