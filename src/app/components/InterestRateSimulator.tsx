/**
 * @fileoverview This component simulates the growth of a balance over time
 * based on a user-defined interest rate. It displays a chart of the projected
 * balance and allows users to adjust the interest rate dynamically using D3.js.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

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
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [interestRate, setInterestRate] = useState(initialRate);

  console.log("rendering:",initialBalance, initialRate);

  //TODO: use alternate solution other than useEffect
  useEffect(() => {
    setInterestRate(initialRate);    
  }, [initialRate]);

  useEffect(() => {
    if (!svgRef.current) return;

    const years = 5;
    const dataPoints = Array.from(
      { length: years * 12 + 1 },
      (_, i): { month: number; amount: number } => {
        const month = i;
        const amount =
          initialBalance * Math.pow(1 + interestRate / 100 / 12, month);
        return { month, amount };
      }
    );

    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("overflow", "visible");

    // Clear previous content
    svg.selectAll("*").remove();

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataPoints, (d: { month: number; amount: number }) => d.month) || 0])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(dataPoints, (d: { month: number; amount: number }) => d.amount) || 0,
        d3.max(dataPoints, (d: { month: number; amount: number }) => d.amount) || 0,
      ])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const xAxis = d3
      .axisBottom(xScale)
      .ticks(10)
      .tickFormat((d: number) => `Month ${d}`);
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(6)
      .tickFormat((d: number) => `$${d}`);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .attr("font-size", "12px")
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .attr("font-size", "12px");

    const line = d3.line()
      .x((d: { month: number; amount: number }) => xScale(d.month))
      .y((d: { month: number; amount: number }) => yScale(d.amount))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(dataPoints)
      .attr("fill", "none")
      .attr("stroke", "#10B981")
      .attr("stroke-width", 2)
      .attr("d", line);

    svg
      .selectAll(".dot")
      .data(dataPoints)
      .join("circle")
      .attr("class", "dot")
      .attr("cx", (d: { month: number; amount: number }) => xScale(d.month))
      .attr("cy", (d: { month: number; amount: number }) => yScale(d.amount))
      .attr("r", 3)
      .attr("fill", "#10B981")
      .attr("stroke", "#FFFFFF")
      .attr("stroke-width", 1);
  }, [initialBalance, interestRate]);

  const projectedBalance = initialBalance * Math.pow(1 + interestRate / 100, 5);
  const totalInterest = projectedBalance - initialBalance;

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
            onChange={(e) => setInterestRate(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">
              Current Balance
            </h3>
            <p className="mt-1 text-xl font-semibold text-gray-900">
              ${initialBalance.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">
              Projected Balance (5 years)
            </h3>
            <p className="mt-1 text-xl font-semibold text-gray-900">
              ${projectedBalance.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Total Interest Earned
          </h3>
          <p className="mt-1 text-xl font-semibold text-green-600">
            ${totalInterest.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white p-3 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Balance Projection
        </h3>
        <div className="h-[300px]">
          <svg ref={svgRef}></svg>
        </div>
      </div>
    </div>
  );
}
