import { BankAccount, Transaction } from "@/types/bank";
import router from "next/router";
import { Session } from "next-auth";



export async function createNewTransaction(session: Session, account: BankAccount, transaction: Omit<
    Transaction,
    "transactionId" | "runningBalance" | "accumulatedInterest"
  >): Promise<Transaction | undefined> {

    try {
      const response = await fetch(
        `/api/accounts/${account.accountId}/transactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.idToken}`,
          },
          body: JSON.stringify(transaction),
        }
      );

      if (response.status === 401) {
        // Token expired, redirect to sign in
        router.push("/");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to create transaction");
      }

      const updatedAccount: BankAccount = await response.json();
      return updatedAccount.transactions[updatedAccount.transactions.length - 1];
    } catch (error) {
      console.error("Error creating transaction:", error);
      return undefined;
    } finally {
    }

  };

