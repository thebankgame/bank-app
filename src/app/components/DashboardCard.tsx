"use client";

interface DashboardCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

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
