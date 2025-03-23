/**
 * @fileoverview Action functions for interacting with the backend API, including creating transactions.
 */

import { BankAccount, Transaction } from "@/types/bank";
import router from "next/router";
import { Session } from "next-auth";

/**
 * Creates a new transaction for a specific bank account.
 *
 * @async
 * @param {Session} session - The current user's session.
 * @param {BankAccount} account - The bank account for which the transaction is being created.
 * @param {Omit<Transaction, "transactionId" | "runningBalance" | "accumulatedInterest">} transaction - The transaction details.
 * @returns {Promise<Transaction | undefined>} The newly created transaction or undefined if the operation fails.
 */
export async function createNewTransaction(
  session: Session,
  account: BankAccount,
  transaction: Omit<
    Transaction,
    "transactionId" | "runningBalance" | "accumulatedInterest"
  >
): Promise<Transaction | undefined> {

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

