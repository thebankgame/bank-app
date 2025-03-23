/**
 * @fileoverview Utility functions for handling bank account-related operations.
 */

/**
 * Generates a random account number in the format XXXX-XXXX-XXXX-XXXX.
 *
 * @returns {string} The generated account number.
 */
export function generateAccountNumber(): string {
  return Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
  ).join("-");
}