"use client";

import { useState } from "react";
import { Slider } from "@mui/material";

interface InterestRateSimulatorProps {
  balance: number;
  currentRate: number;
  onRateChange: (rate: number) => void;
}

export default function InterestRateSimulator({
  balance,
  currentRate,
  onRateChange,
}: InterestRateSimulatorProps) {
  const [rate, setRate] = useState(currentRate);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    const newRate = Array.isArray(newValue) ? newValue[0] : newValue;
    setRate(newRate);
    onRateChange(newRate);
  };

  // Calculate projected balance after 5 years
  const years = 5;
  const projectedBalance = balance * Math.pow(1 + rate / 100, years);
  const currentProjection = balance * Math.pow(1 + currentRate / 100, years);
  const difference = projectedBalance - currentProjection;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          Interest Rate Simulator
        </h3>
        <span className="text-2xl font-bold text-blue-600">{rate}%</span>
      </div>

      <div className="px-2">
        <Slider
          value={rate}
          onChange={handleChange}
          aria-label="Interest Rate"
          min={0}
          max={10}
          step={0.1}
          sx={{
            color: "#2563EB", // blue-600
            "& .MuiSlider-thumb": {
              "&:hover, &.Mui-focusVisible": {
                boxShadow: "0 0 0 8px rgba(37, 99, 235, 0.16)",
              },
              "&.Mui-active": {
                boxShadow: "0 0 0 12px rgba(37, 99, 235, 0.16)",
              },
            },
            "& .MuiSlider-rail": {
              opacity: 0.32,
            },
          }}
        />
      </div>

      <div className="flex justify-between text-sm text-gray-600">
        <span>0%</span>
        <span>5%</span>
        <span>10%</span>
      </div>

      <div className="mt-6 space-y-2">
        <p className="text-sm font-medium text-gray-800">
          Projected Balance (after {years} years):
        </p>
        <p className="text-2xl font-bold text-blue-600">
          $
          {projectedBalance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        <p className="text-sm text-gray-600">
          {difference >= 0 ? "+" : "-"}$
          {Math.abs(difference).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          compared to current rate
        </p>
      </div>
    </div>
  );
}
