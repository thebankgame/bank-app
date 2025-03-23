/**
 * @fileoverview Utility functions for calculating interest and handling date-related operations.
 */

/**
 * Counts the number of midnights crossed between two dates.
 *
 * @param {Date} startDate - The starting date.
 * @param {Date} endDate - The ending date.
 * @returns {number} The number of midnights crossed.
 */
export function countMidnightsCrossed(startDate: Date, endDate: Date): number {
  // Create dates at midnight for comparison
  const startMidnight = new Date(startDate);
  startMidnight.setHours(0, 0, 0, 0);
  const endMidnight = new Date(endDate);
  endMidnight.setHours(0, 0, 0, 0);

  // Calculate the difference in days
  return Math.floor(
    (endMidnight.getTime() - startMidnight.getTime()) / (1000 * 60 * 60 * 24)
  );
}

/**
 * Calculates the daily interest based on the annual interest rate and the previous balance.
 *
 * @param {number} previousBalance - The balance before interest is applied.
 * @param {number} annualInterestRate - The annual interest rate as a percentage.
 * @param {number} daysSinceLastTransaction - The number of days since the last transaction.
 * @returns {number} The calculated daily interest.
 */
export function calculateDailyInterest(
  previousBalance: number,
  annualInterestRate: number,
  daysSinceLastTransaction: number
): number {
  if (daysSinceLastTransaction <= 0) return 0;

  const dailyRate = annualInterestRate / 100 / 365; // Convert annual percentage to daily decimal
  return (
    previousBalance * Math.pow(1 + dailyRate, daysSinceLastTransaction) - 
    previousBalance
  );
}