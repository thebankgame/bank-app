/**
 * @fileoverview This component visualizes the growth of a balance over time
 * using D3.js. It calculates and displays projected balances based on
 * the provided initial balance and interest rate.
 */

"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

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
 * A component that visualizes the growth of a balance over time using D3.js.
 *
 * @param {CompoundInterestChartProps} props - The props for the component.
 * @returns {JSX.Element} The JSX structure for the compound interest chart.
 */
export default function CompoundInterestChart({
  balance = 0,
  interestRate = 0,
}: CompoundInterestChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const years = 5;

    // Explicitly type dataPoints
    const dataPoints: { month: number; amount: number }[] = Array.from(
      { length: years * 12 + 1 },
      (_, i) => {
        const month = i;
        const amount = balance * Math.pow(1 + interestRate / 100 / 12, month);
        return { month, amount };
      }
    );

    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 }; // Increased bottom margin for rotated labels

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("overflow", "visible");

    // Clear previous content
    svg.selectAll("*").remove();

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataPoints, (d: { month: number }) => d.month) || 0])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(dataPoints, (d: { amount: number }) => d.amount) || 0,
        d3.max(dataPoints, (d: { amount: number }) => d.amount) || 0,
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
      .selectAll("text") // Select all x-axis labels
      .attr("transform", "rotate(-45)") // Rotate labels by -45 degrees
      .style("text-anchor", "end"); // Align text to the end for better readability

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .attr("font-size", "12px");

    const line = d3
      .line()
      .x((d: { month: number; amount: number }) => xScale(d.month))
      .y((d: { month: number; amount: number }) => yScale(d.amount))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(dataPoints)
      .attr("fill", "none")
      .attr("stroke", "#3B82F6")
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
      .attr("fill", "#3B82F6")
      .attr("stroke", "#FFFFFF")
      .attr("stroke-width", 1);
  }, [balance, interestRate]);

  return (
    <div className="w-full h-full">
      <svg ref={svgRef}></svg>
    </div>
  );
}
