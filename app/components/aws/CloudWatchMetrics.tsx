'use client';

import { useState, useEffect } from 'react';
import { useEnvironment } from '../../context/EnvironmentContext';

interface MetricData {
  id: string;
  name: string;
  namespace: string;
  dimensions: {
    name: string;
    value: string;
  }[];
  statistics: string[];
  unit: string;
  period: number;
  values: {
    timestamp: string;
    value: number;
  }[];
}

interface CloudWatchMetricsProps {
  resourceId?: string;
  namespace?: string;
  metricNames?: string[];
  className?: string;
}

const CloudWatchMetrics = ({
  resourceId,
  namespace = 'AWS/EC2',
  metricNames = ['CPUUtilization', 'NetworkIn', 'NetworkOut', 'DiskReadBytes', 'DiskWriteBytes'],
  className = ''
}: CloudWatchMetricsProps) => {
  const { currentEnv } = useEnvironment();
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '1d' | '1w' | '1m'>('1d');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(metricNames.slice(0, 2));
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);
  
  // Fetch metrics data
  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams({
          environment: currentEnv.id,
          namespace,
          timeRange,
          ...(resourceId && { resourceId }),
          metrics: selectedMetrics.join(',')
        });
        
        const response = await fetch(`/api/aws/cloudwatch/metrics?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setMetrics(data.metrics || []);
      } catch (e: any) {
        console.error('Error fetching CloudWatch metrics:', e);
        setError(e.message || 'Failed to fetch CloudWatch metrics');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetrics();
    
    // Set up refresh interval if specified
    if (refreshInterval) {
      const intervalId = setInterval(fetchMetrics, refreshInterval * 1000);
      return () => clearInterval(intervalId);
    }
  }, [currentEnv.id, namespace, timeRange, selectedMetrics, resourceId, refreshInterval]);
  
  // Format the data for the chart
  const formatChartData = (metric: MetricData) => {
    return {
      id: metric.id,
      name: metric.name,
      data: metric.values.map(v => ({
        x: new Date(v.timestamp).getTime(),
        y: v.value
      }))
    };
  };
  
  // Get the unit label for the metric
  const getUnitLabel = (unit: string) => {
    switch (unit) {
      case 'Percent': return '%';
      case 'Bytes': return 'B';
      case 'Bytes/Second': return 'B/s';
      case 'Count': return '';
      case 'Count/Second': return '/s';
      default: return unit;
    }
  };
  
  // Format the value based on the unit
  const formatValue = (value: number, unit: string) => {
    switch (unit) {
      case 'Bytes':
      case 'Bytes/Second':
        if (value >= 1073741824) return `${(value / 1073741824).toFixed(2)} GB`;
        if (value >= 1048576) return `${(value / 1048576).toFixed(2)} MB`;
        if (value >= 1024) return `${(value / 1024).toFixed(2)} KB`;
        return `${value.toFixed(2)} B`;
      case 'Percent':
        return `${value.toFixed(2)}%`;
      default:
        return value.toFixed(2);
    }
  };
  
  return (
    <div className={`${className}`}>
      <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800">CloudWatch Metrics</h2>
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="1d">Last Day</option>
              <option value="1w">Last Week</option>
              <option value="1m">Last Month</option>
            </select>
            <select
              value={refreshInterval || ''}
              onChange={(e) => setRefreshInterval(e.target.value ? parseInt(e.target.value) : null)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="">No Refresh</option>
              <option value="30">30 Seconds</option>
              <option value="60">1 Minute</option>
              <option value="300">5 Minutes</option>
              <option value="600">10 Minutes</option>
            </select>
            <button
              onClick={() => {
                // Export functionality would go here
                console.log('Exporting data:', metrics);
              }}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Export
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Metrics
          </label>
          <div className="flex flex-wrap gap-2">
            {metricNames.map(metric => (
              <button
                key={metric}
                onClick={() => {
                  if (selectedMetrics.includes(metric)) {
                    setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
                  } else {
                    setSelectedMetrics([...selectedMetrics, metric]);
                  }
                }}
                className={`px-2 py-1 text-xs rounded-full ${
                  selectedMetrics.includes(metric)
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300'
                }`}
              >
                {metric}
              </button>
            ))}
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-gray-600">Loading metrics...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-lg">
            <p className="font-medium">Error loading metrics</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => setTimeRange(timeRange)} // Trigger a refresh
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : metrics.length === 0 ? (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-gray-500">No metrics available</p>
            <p className="text-sm text-gray-400 mt-1">Try selecting different metrics or time range</p>
          </div>
        ) : (
          <div className="space-y-6">
            {metrics.map(metric => (
              <div key={metric.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-800">{metric.name}</h3>
                    <p className="text-xs text-gray-500">
                      {metric.namespace} • {metric.dimensions.map(d => `${d.name}: ${d.value}`).join(', ')}
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    {metric.values.length > 0 && (
                      <span className="text-blue-600">
                        Latest: {formatValue(metric.values[metric.values.length - 1].value, metric.unit)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  {/* This would be a chart component in a real implementation */}
                  <div className="h-64 bg-gray-50 border border-gray-200 rounded flex items-center justify-center">
                    <p className="text-gray-500">Chart visualization would be rendered here</p>
                  </div>
                  <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-500">Min</p>
                      <p className="font-medium">
                        {formatValue(
                          Math.min(...metric.values.map(v => v.value)),
                          metric.unit
                        )}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-500">Max</p>
                      <p className="font-medium">
                        {formatValue(
                          Math.max(...metric.values.map(v => v.value)),
                          metric.unit
                        )}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-500">Average</p>
                      <p className="font-medium">
                        {formatValue(
                          metric.values.reduce((sum, v) => sum + v.value, 0) / metric.values.length,
                          metric.unit
                        )}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-500">Data Points</p>
                      <p className="font-medium">{metric.values.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CloudWatchMetrics;
