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
  ReferenceLine,
  Brush
} from 'recharts';

interface PredictiveDataPoint {
  timestamp: string;
  value: number;
  isPredict: boolean;
  formattedTime?: string;
  displayValue?: number;
}

interface PredictiveChartProps {
  title: string;
  metric: string;
  namespace?: string;
  dimensionName?: string;
  dimensionValue?: string;
  daysBack?: number;
  predictionHours?: number;
  environment?: string;
  height?: number | string;
}

export default function PredictiveChart({
  title,
  metric,
  namespace = 'AWS/EC2',
  dimensionName = 'InstanceId',
  dimensionValue = 'i-1234567890abcdef0',
  daysBack = 30,
  predictionHours = 24,
  environment = 'dev',
  height = 400
}: PredictiveChartProps) {
  const [data, setData] = useState<PredictiveDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nowIndex, setNowIndex] = useState<number>(-1);

  useEffect(() => {
    const fetchPredictiveData = async () => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams({
          environment,
          namespace,
          metricName: metric,
          dimensionName,
          dimensionValue,
          daysBack: daysBack.toString(),
          predictionHours: predictionHours.toString()
        });

        const response = await fetch(`/api/predict/metrics?${queryParams}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch predictive data');
        }

        // Format the data for the chart
        const formattedData = result.data.map((point: PredictiveDataPoint, index: number) => ({
          ...point,
          // Format timestamp for display
          formattedTime: new Date(point.timestamp).toLocaleString(),
          // Add a field to help with tooltip display
          displayValue: point.value
        }));

        setData(formattedData);

        // Find the index where predictions start (first point with isPredict=true)
        const predictStartIndex = formattedData.findIndex((point: PredictiveDataPoint) => point.isPredict);
        if (predictStartIndex > 0) {
          setNowIndex(predictStartIndex - 1);
        }
      } catch (e: any) {
        console.error('Error fetching predictive data:', e);
        setError(e.message || 'Failed to fetch predictive data');
      } finally {
        setLoading(false);
      }
    };

    fetchPredictiveData();
  }, [environment, namespace, metric, dimensionName, dimensionValue, daysBack, predictionHours]);

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
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
          <p className="text-sm font-medium">{dataPoint.formattedTime}</p>
          <p className="text-sm">
            <span className="font-medium">{metric}: </span>
            <span className={dataPoint.isPredict ? 'text-purple-600 dark:text-purple-400' : 'text-blue-600 dark:text-blue-400'}>
              {formatYAxis(dataPoint.displayValue)}
            </span>
          </p>
          <p className="text-xs mt-1">
            {dataPoint.isPredict ? 'Predicted value' : 'Historical value'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Resource: {dimensionValue}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Historical</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-3 h-3 rounded-full bg-purple-500"></span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Predicted</span>
          </div>
        </div>
      </div>

      <div style={{ height: height, width: '100%' }}>
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading predictive data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">No data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis
                dataKey="formattedTime"
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
              
              {/* Historical Data Line */}
              <Line
                type="monotone"
                dataKey="displayValue"
                name="Historical"
                stroke="#3b82f6" // blue-500
                strokeWidth={2}
                dot={{ r: 1 }}
                activeDot={{ r: 5, stroke: '#1e40af', strokeWidth: 1 }}
                isAnimationActive={false}
                connectNulls={true}
              />
              
              {/* Prediction Line (rendered on top of historical) */}
              <Line
                type="monotone"
                dataKey={(dataPoint: PredictiveDataPoint) => dataPoint.isPredict ? dataPoint.displayValue : null}
                name="Prediction"
                stroke="#8b5cf6" // purple-500
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 2 }}
                activeDot={{ r: 5, stroke: '#6d28d9', strokeWidth: 1 }}
                isAnimationActive={false}
                connectNulls={true}
              />
              
              {/* Reference line for "now" */}
              {nowIndex >= 0 && (
                <ReferenceLine
                  x={data[nowIndex].formattedTime}
                  stroke="#ef4444" // red-500
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  label={{
                    value: 'Now',
                    position: 'insideTopRight',
                    fill: '#ef4444',
                    fontSize: 12
                  }}
                />
              )}
              
              <Brush
                dataKey="formattedTime"
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
        )}
      </div>
      
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>Showing {daysBack} days of historical data and {predictionHours} hours of predictions</p>
      </div>
    </div>
  );
}
