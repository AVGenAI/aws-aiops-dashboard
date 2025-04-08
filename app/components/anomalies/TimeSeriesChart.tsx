"use client";

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush
} from 'recharts';

interface TimeSeriesData {
  timestamp: string;
  value: number;
  status?: 'Normal' | 'Warning' | 'Critical';
}

interface TimeSeriesChartProps {
  data: TimeSeriesData[];
  title: string;
  metric: string;
  timeRange: '1h' | '6h' | '1d' | '1w' | '1m';
  onTimeRangeChange?: (range: '1h' | '6h' | '1d' | '1w' | '1m') => void;
}

export default function TimeSeriesChart({ 
  data, 
  title, 
  metric, 
  timeRange, 
  onTimeRangeChange 
}: TimeSeriesChartProps) {
  const [chartData, setChartData] = useState<TimeSeriesData[]>([]);

  useEffect(() => {
    // Format the data for the chart
    const formattedData = data.map(item => ({
      ...item,
      timestamp: new Date(item.timestamp).toLocaleString(),
    }));
    
    setChartData(formattedData);
  }, [data]);

  const getStatusColor = (status?: 'Normal' | 'Warning' | 'Critical') => {
    switch (status) {
      case 'Critical':
        return '#ef4444'; // red-500
      case 'Warning':
        return '#f59e0b'; // amber-500
      case 'Normal':
        return '#10b981'; // emerald-500
      default:
        return '#3b82f6'; // blue-500
    }
  };

  const formatYAxis = (value: number): string => {
    // Format based on the metric type
    if (metric.includes('CPU') || metric.includes('Memory') || metric.includes('Disk')) {
      return `${value}%`;
    } else if (metric.includes('Latency')) {
      return `${value}ms`;
    } else if (metric.includes('Count') || metric.includes('Errors')) {
      return value.toLocaleString();
    } else {
      return value.toString();
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md dark:bg-dark-card dark:border-dark-border dark:text-dark-text">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm">
            <span className="font-medium">{metric}: </span>
            <span style={{ color: getStatusColor(dataPoint.status) }}>
              {formatYAxis(dataPoint.value)}
            </span>
          </p>
          {dataPoint.status && (
            <p className="text-xs mt-1" style={{ color: getStatusColor(dataPoint.status) }}>
              Status: {dataPoint.status}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm dark:bg-dark-card dark:border-dark-border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text">{title}</h3>
        <div className="flex space-x-1">
          {(['1h', '6h', '1d', '1w', '1m'] as const).map((range) => (
            <button
              key={range}
              onClick={() => onTimeRangeChange && onTimeRangeChange(range)}
              className={`px-2 py-1 text-xs rounded ${
                timeRange === range
                  ? 'bg-blue-100 text-blue-700 font-medium dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-64 w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis 
                dataKey="timestamp" 
                tick={{ fontSize: 12 }} 
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }}
                className="dark:text-gray-400"
              />
              <YAxis 
                tickFormatter={formatYAxis} 
                tick={{ fontSize: 12 }}
                className="dark:text-gray-400"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name={metric}
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5, stroke: '#1e40af', strokeWidth: 1 }}
              />
              <Brush 
                dataKey="timestamp" 
                height={30} 
                stroke="#3b82f6"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }}
                className="dark:text-gray-400"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">No data available for the selected time range</p>
          </div>
        )}
      </div>
    </div>
  );
}
