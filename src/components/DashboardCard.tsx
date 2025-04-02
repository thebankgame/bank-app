/**
 * @fileoverview This component provides a reusable card layout for displaying
 * dashboard content. It supports an optional title and custom content.
 */

"use client";

/**
 * Props for the DashboardCard component.
 *
 * @typedef {Object} DashboardCardProps
 * @property {string} [title] - The optional title of the card.
 * @property {React.ReactNode} children - The content to display inside the card.
 * @property {string} [className] - Additional CSS classes for the card.
 */
interface DashboardCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * A reusable card component for displaying dashboard content.
 *
 * @param {DashboardCardProps} props - The props for the component.
 * @returns {JSX.Element} The JSX structure for the dashboard card.
 */
export default function DashboardCard({
  title,
  children,
  className = "",
}: DashboardCardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 ${className}`}
    >
      {title && (
        <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
          {title}
        </h2>
      )}
      <div className="text-gray-600">{children}</div>
    </div>
  );
}
