/**
 * @fileoverview This component simulates the growth of a balance over time
 * based on a user-defined interest rate. It displays a chart of the projected
 * balance and allows users to adjust the interest rate dynamically.
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // Ensure Filler plugin is registered
);

/**
 * Props for the InterestRateSimulator component.
 *
 * @typedef {Object} InterestRateSimulatorProps
 * @property {number | undefined} initialBalance - The initial balance to simulate.
 * @property {number | undefined} initialRate - The initial interest rate to simulate.
 */
interface InterestRateSimulatorProps {
  initialBalance: number | undefined;
  initialRate: number | undefined;
}

/**
 * A component that simulates and visualizes the growth of a balance over time
 * based on a user-defined interest rate.
 *
 * @param {InterestRateSimulatorProps} props - The props for the component.
 * @returns {JSX.Element} The JSX structure for the interest rate simulator.
 */
export default function InterestRateSimulator({
  initialBalance = 0,
  initialRate = 0,
}: InterestRateSimulatorProps) {
  console.log("InterestRateSimulator props:", { initialBalance, initialRate });

  const [balance, setBalance] = useState(initialBalance);
  const [interestRate, setInterestRate] = useState(initialRate);

  // Ensure deterministic calculations
  const dataPoints = useMemo(() => {
    const years = 5;
    const dataPoints = Array.from({ length: years * 12 + 1 }, (_, i) => {
      const month = i;
      const amount = balance * Math.pow(1 + interestRate / 100 / 12, month);
      return {
        month,
        amount,
      };
    });
    return dataPoints.map((point) => {
      const date = new Date();
      date.setMonth(date.getMonth() + point.month);
      return {
        label: date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        value: Math.round(point.amount * 100) / 100,
      };
    });
  }, [initialBalance, initialRate]);

  const data = useMemo(
    () => ({
      labels: dataPoints.map((point) => point.label),
      datasets: [
        {
          label: "Interest Simulation",
          data: dataPoints.map((point) => point.value),
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          fill: true,
        },
      ],
    }),
    [dataPoints]
  );

  /**
   * Handles changes to the interest rate slider.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from the slider.
   */
  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRate = parseFloat(e.target.value);
    setInterestRate(newRate);
  };

  const projectedBalance = balance * Math.pow(1 + interestRate / 100, 5);

  const formattedProjectedBalance: string = projectedBalance.toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );
  const totalInterest = projectedBalance - balance;
  const formattedTotalInterest: string = totalInterest.toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          color: "#4B5563", // text-gray-600
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1F2937", // text-gray-800
        bodyColor: "#4B5563", // text-gray-600
        borderColor: "#E5E7EB", // border-gray-200
        borderWidth: 1,
        padding: 12,
        bodyFont: {
          family: "'Inter', sans-serif",
        },
        titleFont: {
          family: "'Inter', sans-serif",
          weight: 600,
        },
        callbacks: {
          label: (context) => {
            return `Balance: $${context.parsed.y.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "#F3F4F6", // gray-100
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          color: "#6B7280", // text-gray-500
        },
      },
      y: {
        grid: {
          color: "#F3F4F6", // gray-100
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          color: "#6B7280", // text-gray-500
          callback: (value) => {
            return `$${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interest Rate: {interestRate.toFixed(1)}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={interestRate}
            onChange={handleRateChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">
              Current Balance
            </h3>
            <p className="mt-1 text-xl font-semibold text-gray-900">
              ${balance.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">
              Projected Balance (5 years)
            </h3>
            <p className="mt-1 text-xl font-semibold text-gray-900">
              ${formattedProjectedBalance}
            </p>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Total Interest Earned
          </h3>
          <p className="mt-1 text-xl font-semibold text-green-600">
            ${formattedTotalInterest}
          </p>
        </div>
      </div>

      <div className="bg-white p-3 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Balance Projection
        </h3>
        <div className="h-[300px]">
          <Line options={options} data={data} />
        </div>
      </div>
    </div>
  );
}
