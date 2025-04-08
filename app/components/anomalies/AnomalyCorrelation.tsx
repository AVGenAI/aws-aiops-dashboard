"use client";

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface CorrelationData {
  name: string;
  count: number;
  critical: number;
  warning: number;
  normal: number;
  relatedTo?: string[];
}

interface AnomalyCorrelationProps {
  data: CorrelationData[];
  title: string;
  onSelectAnomaly?: (name: string) => void;
}

export default function AnomalyCorrelation({ 
  data, 
  title,
  onSelectAnomaly
}: AnomalyCorrelationProps) {
  const [chartData, setChartData] = useState<CorrelationData[]>([]);
  const [selectedBar, setSelectedBar] = useState<string | null>(null);

  useEffect(() => {
    // Sort data by count in descending order
    const sortedData = [...data].sort((a, b) => b.count - a.count);
    setChartData(sortedData);
  }, [data]);

  const handleBarClick = (data: any) => {
    const name = data.name;
    setSelectedBar(name === selectedBar ? null : name);
    if (onSelectAnomaly) {
      onSelectAnomaly(name);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md dark:bg-dark-card dark:border-dark-border dark:text-dark-text">
          <p className="text-sm font-medium">{data.name}</p>
          <div className="mt-2 space-y-1">
            <p className="text-xs">
              <span className="font-medium">Total Anomalies: </span>
              {data.count}
            </p>
            <p className="text-xs text-red-600 dark:text-red-400">
              <span className="font-medium">Critical: </span>
              {data.critical}
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              <span className="font-medium">Warning: </span>
              {data.warning}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">
              <span className="font-medium">Normal: </span>
              {data.normal}
            </p>
          </div>
          {data.relatedTo && data.relatedTo.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium">Related to:</p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {data.relatedTo.map((related: string, index: number) => (
                  <li key={index}>• {related}</li>
                ))}
              </ul>
            </div>
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
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Critical</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Warning</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Normal</span>
          </div>
        </div>
      </div>
      
      <div className="h-64 w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              barSize={30}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                height={50}
                angle={-45}
                tickMargin={30}
                className="dark:text-gray-400"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                className="dark:text-gray-400"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="critical" 
                name="Critical" 
                stackId="a" 
                fill="#ef4444" 
                onClick={handleBarClick}
                cursor="pointer"
              />
              <Bar 
                dataKey="warning" 
                name="Warning" 
                stackId="a" 
                fill="#f59e0b" 
                onClick={handleBarClick}
                cursor="pointer"
              />
              <Bar 
                dataKey="normal" 
                name="Normal" 
                stackId="a" 
                fill="#10b981" 
                onClick={handleBarClick}
                cursor="pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">No correlation data available</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>Click on a bar to see related anomalies and details</p>
      </div>
      
      {selectedBar && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
          <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
            Selected: {selectedBar}
          </h4>
          {chartData.find(item => item.name === selectedBar)?.relatedTo && (
            <div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Related anomalies:</p>
              <ul className="mt-1 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                {chartData.find(item => item.name === selectedBar)?.relatedTo?.map((related, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-1">•</span>
                    <span>{related}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
