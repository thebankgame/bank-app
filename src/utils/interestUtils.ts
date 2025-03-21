// Count the number of midnights between two dates
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

// Calculate daily interest based on annual rate and previous balance
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