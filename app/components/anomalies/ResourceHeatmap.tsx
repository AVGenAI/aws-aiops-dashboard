"use client";

import { useState, useEffect } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface ResourceData {
  id: string;
  name: string;
  type: string;
  x: number; // CPU utilization
  y: number; // Memory utilization
  z: number; // Anomaly score (0-1)
  status: 'Normal' | 'Warning' | 'Critical';
}

interface ResourceHeatmapProps {
  data: ResourceData[];
  title: string;
  xMetric?: string;
  yMetric?: string;
}

export default function ResourceHeatmap({ 
  data, 
  title,
  xMetric = 'CPU Utilization',
  yMetric = 'Memory Utilization'
}: ResourceHeatmapProps) {
  const [chartData, setChartData] = useState<ResourceData[]>([]);

  useEffect(() => {
    setChartData(data);
  }, [data]);

  const getStatusColor = (status: 'Normal' | 'Warning' | 'Critical') => {
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md dark:bg-dark-card dark:border-dark-border dark:text-dark-text">
          <p className="text-sm font-medium">{data.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{data.type}</p>
          <div className="mt-2 space-y-1">
            <p className="text-xs">
              <span className="font-medium">{xMetric}: </span>
              {data.x}%
            </p>
            <p className="text-xs">
              <span className="font-medium">{yMetric}: </span>
              {data.y}%
            </p>
            <p className="text-xs">
              <span className="font-medium">Anomaly Score: </span>
              {(data.z * 100).toFixed(0)}%
            </p>
          </div>
          <p className="text-xs mt-2 font-medium" style={{ color: getStatusColor(data.status) }}>
            Status: {data.status}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm dark:bg-dark-card dark:border-dark-border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text">{title}</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Normal</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Warning</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Critical</span>
          </div>
        </div>
      </div>
      
      <div className="h-64 w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name={xMetric} 
                unit="%" 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                className="dark:text-gray-400"
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name={yMetric} 
                unit="%" 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                className="dark:text-gray-400"
              />
              <ZAxis 
                type="number" 
                dataKey="z" 
                range={[50, 500]} 
                name="Anomaly Score" 
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Scatter name="Resources" data={chartData}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getStatusColor(entry.status)} 
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">No resource data available</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>Bubble size represents anomaly score - larger bubbles indicate higher anomaly scores</p>
      </div>
    </div>
  );
}
