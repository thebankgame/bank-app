"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
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
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Dynamically import Chart.js components with no SSR
// const Chart = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
//   ssr: false,
//   loading: () => (
//     <div className="h-[200px] flex items-center justify-center">
//       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//     </div>
//   ),
// });

interface InterestRateSimulatorProps {
  initialBalance: number | undefined;
  initialRate: number | undefined;
}

export default function InterestRateSimulator({
  initialBalance = 0,
  initialRate = 0,
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

  // TODO: remove useEffect - unnecessary here
  // Update balance when initialBalance changes
  useEffect(() => {
    setBalance(initialBalance || 0);
  }, [initialBalance]);

  // TODO: remove useEffect - unnecessary here
  // Update balance when initialBalance changes
  useEffect(() => {
    setInterestRate(initialRate || 0);
  }, [initialRate]);

  // TODO: remove useEffect - unnecessary here
  useEffect(() => {
    // Generate data points for 5 years
    const years = 5;
    const dataPoints = Array.from({ length: years * 12 + 1 }, (_, i) => {
      const month = i;
      const amount = balance * Math.pow(1 + interestRate / 100 / 12, month);
      return {
        month,
        amount,
      };
    });
    const months = years * 12;
    const monthlyRate = interestRate / 100 / 12;

    const data = Array.from({ length: months + 1 }, (_, i) => {
      const monthlyBalance = balance * Math.pow(1 + monthlyRate, i);
      return Math.round(monthlyBalance * 100) / 100;
    });

    setChartData({
      labels: dataPoints.map((point) => {
        const date = new Date();
        date.setMonth(date.getMonth() + point.month);
        return date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
      }),
      datasets: [
        {
          label: "Projected Balance",
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
        {/* <div className="w-full h-full"> */}
          <Line options={options} data={chartData} />
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}
