'use client';

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
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CompoundInterestChartProps {
  initialBalance: number;
  interestRate: number;
  years: number;
}

export default function CompoundInterestChart({
  initialBalance,
  interestRate,
  years = 5,
}: CompoundInterestChartProps) {
  // Calculate compound interest for each month over the specified years
  const calculateCompoundInterest = () => {
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = years * 12;
    const values = [];
    const labels = [];
    
    let currentBalance = initialBalance;
    
    for (let month = 0; month <= totalMonths; month++) {
      values.push(currentBalance);
      
      // Format date for label
      const date = new Date();
      date.setMonth(date.getMonth() + month);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
      
      // Calculate next month's balance with compound interest
      currentBalance *= (1 + monthlyRate);
    }
    
    return { values, labels };
  };

  const { values, labels } = calculateCompoundInterest();

  const data = {
    labels,
    datasets: [
      {
        label: 'Account Balance',
        data: values,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Compound Interest Growth Projection',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (typeof context.parsed.y === 'number') {
              return `Balance: ${new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(context.parsed.y)}`;
            }
            return '';
          },
        },
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        beginAtZero: false,
        ticks: {
          callback: function(value) {
            if (typeof value === 'number') {
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(value);
            }
            return '';
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-[400px]">
      <Line options={options} data={data} />
    </div>
  );
}
