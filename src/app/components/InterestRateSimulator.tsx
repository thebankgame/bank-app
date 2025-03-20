"use client";

import { useState, useCallback } from "react";
import CompoundInterestChart from "./CompoundInterestChart";

interface InterestRateSimulatorProps {
  initialBalance: number;
  currentInterestRate: number;
}

export default function InterestRateSimulator({
  initialBalance,
  currentInterestRate,
}: InterestRateSimulatorProps) {
  const [simulatedRate, setSimulatedRate] = useState(currentInterestRate);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;

      // Calculate percentage (0-100)
      let percentage = (x / width) * 100;
      percentage = Math.max(0, Math.min(100, percentage));

      setSimulatedRate(Number(percentage.toFixed(1)));
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = "default";
  }, []);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
    document.body.style.cursor = "grabbing";
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      if (!isNaN(value)) {
        setSimulatedRate(Math.max(0, Math.min(100, value)));
      }
    },
    []
  );

  // Add global mouse up listener
  if (typeof window !== "undefined") {
    window.addEventListener("mouseup", handleMouseUp);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="flex-grow">
          <div
            className="h-8 bg-gray-200 rounded-lg relative cursor-pointer"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
          >
            {/* Track filled */}
            <div
              className="h-full bg-blue-500 rounded-lg"
              style={{ width: `${simulatedRate}%` }}
            />

            {/* Thumb */}
            <div
              className="absolute top-0 h-8 w-8 bg-white border-2 border-blue-500 rounded-full shadow-lg transform -translate-x-1/2"
              style={{ left: `${simulatedRate}%` }}
            />

            {/* Current rate marker */}
            <div
              className="absolute top-0 h-8 w-1 bg-green-500"
              style={{ left: `${currentInterestRate}%` }}
              title="Current Interest Rate"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={simulatedRate}
            onChange={handleInputChange}
            className="w-20 px-2 py-1 border border-gray-300 rounded-md text-right bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
            max="100"
            step="0.1"
          />
          <span className="text-2xl font-semibold text-gray-900">%</span>
        </div>
      </div>

      <div className="flex justify-between text-sm text-gray-500 px-2">
        <span>0%</span>
        <div className="space-x-1">
          <span className="text-green-500">Current:</span>
          <span className="text-green-500">{currentInterestRate}%</span>
        </div>
        <span>100%</span>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 mt-4">
        <p className="text-sm text-blue-800 mb-2">
          {simulatedRate > currentInterestRate ? (
            <>
              At {simulatedRate}% interest rate, your money would grow{" "}
              <span className="font-semibold">
                {(
                  ((simulatedRate - currentInterestRate) /
                    currentInterestRate) *
                  100
                ).toFixed(1)}
                % faster
              </span>{" "}
              than your current rate.
            </>
          ) : simulatedRate < currentInterestRate ? (
            <>
              At {simulatedRate}% interest rate, your money would grow{" "}
              <span className="font-semibold">
                {(
                  ((currentInterestRate - simulatedRate) /
                    currentInterestRate) *
                  100
                ).toFixed(1)}
                % slower
              </span>{" "}
              than your current rate.
            </>
          ) : (
            "This is your current interest rate."
          )}
        </p>
        <CompoundInterestChart
          initialBalance={initialBalance}
          interestRate={simulatedRate}
          years={5}
        />
      </div>
    </div>
  );
}
