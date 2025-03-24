/**
 * @fileoverview This component visualizes the growth of a balance over time
 * using a line chart. It calculates and displays projected balances based on
 * the provided initial balance and interest rate.
 */

"use client";

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
import { useMemo } from "react";

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
 * Props for the CompoundInterestChart component.
 *
 * @typedef {Object} CompoundInterestChartProps
 * @property {number | undefined} balance - The initial balance to simulate.
 * @property {number | undefined} interestRate - The annual interest rate to simulate.
 */
interface CompoundInterestChartProps {
  balance: number | undefined;
  interestRate: number | undefined;
}

/**
 * A component that visualizes the growth of a balance over time using a line chart.
 *
 * @param {CompoundInterestChartProps} props - The props for the component.
 * @returns {JSX.Element} The JSX structure for the compound interest chart.
 */
export default function CompoundInterestChart({
  balance = 0,
  interestRate = 0,
}: CompoundInterestChartProps) {
  const years = 5;

  console.log("balance: ", balance);
  console.log("interestRate: ", interestRate);
  console.log("years: ", years);

  // Precompute data points
  const dataPoints = useMemo(() => {
    return Array.from({ length: years * 12 + 1 }, (_, i) => {
      const month = i;
      const amount = balance * Math.pow(1 + interestRate / 100 / 12, month);
      return { month, amount };
    });
  }, [balance, interestRate]);

  console.log("dataPoints: ", dataPoints);

  // Precompute labels
  const labels = useMemo(() => {
    return dataPoints.map((point) => `Month ${point.month}`);
  }, [dataPoints]);

  console.log("labels: ", labels);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Projected Balance",
          data: dataPoints.map((point) => point.amount),
          borderColor: "#3B82F6", // blue-500
          backgroundColor: "rgba(59, 130, 246, 0.1)", // blue-500 with opacity
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: "#3B82F6",
          pointHoverBorderColor: "#FFFFFF",
          pointHoverBorderWidth: 2,
          tension: 0.4,
          fill: true,
        },
      ],
    }),
    [labels, dataPoints]
  );
  console.log("3: ", data);

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
            return `Balance: $${context.parsed.y.toFixed(2)}`;
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
          // callback: (value) => {
          //   return `$${value.toLocaleString()}`;
          // },
        },
      },
    },
  };

  console.log("options: ", options);

  return (
    <div className="w-full h-full">
      {/* <Line options={options} data={data} /> */}
      <Line data={data} />
      </div>
  );
}
