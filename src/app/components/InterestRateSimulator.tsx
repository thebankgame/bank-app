"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import Chart.js components with no SSR
const Chart = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
  loading: () => (
    <div className="h-[200px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  ),
});

interface InterestRateSimulatorProps {
  initialBalance: number;
  initialRate: number;
}

export default function InterestRateSimulator({
  initialBalance,
  initialRate,
}: InterestRateSimulatorProps) {
  console.log("InterestRateSimulator props:", { initialBalance, initialRate });

  const [balance, setBalance] = useState(initialBalance);
  const [interestRate, setInterestRate] = useState(initialRate);
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
      fill: boolean;
    }[];
  }>({
    labels: [],
    datasets: [],
  });

  // Update balance when initialBalance changes
  useEffect(() => {
    setBalance(initialBalance || 0);
  }, [initialBalance]);

  // Update balance when initialBalance changes
  useEffect(() => {
    setInterestRate(initialRate || 0);
  }, [initialRate]);

  useEffect(() => {
    // Generate data points for 5 years
    const years = 5;
    const months = years * 12;
    const monthlyRate = interestRate / 100 / 12;

    const labels = Array.from({ length: months + 1 }, (_, i) => {
      const year = Math.floor(i / 12);
      const month = i % 12;
      return `${year}y ${month}m`;
    });

    const data = Array.from({ length: months + 1 }, (_, i) => {
      const monthlyBalance = balance * Math.pow(1 + monthlyRate, i);
      return Math.round(monthlyBalance * 100) / 100;
    });

    setChartData({
      labels,
      datasets: [
        {
          label: "Account Balance",
          data: data,
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          tension: 0.4,
          fill: false,
        },
      ],
    });
  }, [balance, interestRate]);

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRate = parseFloat(e.target.value);
    setInterestRate(newRate);
  };

  const projectedBalance = balance * Math.pow(1 + interestRate / 100, 5);
  // Using toLocaleString() method
const formattedProjectedBalance: string = projectedBalance.toLocaleString(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
  const totalInterest = projectedBalance - balance;
  const formattedTotalInterest: string = totalInterest.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
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
        <div className="h-[200px]">
          <Chart
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "top" as const,
                  labels: {
                    boxWidth: 12,
                    padding: 8,
                  },
                },
                title: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: false,
                  ticks: {
                    callback: (value) => `$${value.toLocaleString()}`,
                    maxRotation: 0,
                  },
                },
                x: {
                  ticks: {
                    maxRotation: 45,
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
