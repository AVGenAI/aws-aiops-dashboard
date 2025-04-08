"use client";

import { useState, useEffect } from 'react';
import { useEnvironment } from '../context/EnvironmentContext';
import PredictiveChart from '../components/predictive/PredictiveChart';

interface ResourceOption {
  id: string;
  name: string;
  type: string;
  metrics: string[];
}

export default function PredictivePage() {
  const { currentEnv } = useEnvironment();
  const [resources, setResources] = useState<ResourceOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Selected options
  const [selectedResource, setSelectedResource] = useState<string>('');
  const [selectedMetric, setSelectedMetric] = useState<string>('CPUUtilization');
  const [daysBack, setDaysBack] = useState<number>(30);
  const [predictionHours, setPredictionHours] = useState<number>(24);
  
  // Resource type and dimension info
  const [resourceType, setResourceType] = useState<string>('EC2');
  const [dimensionName, setDimensionName] = useState<string>('InstanceId');
  const [namespace, setNamespace] = useState<string>('AWS/EC2');
  
  // Available metrics for the selected resource type
  const [availableMetrics, setAvailableMetrics] = useState<string[]>([
    'CPUUtilization',
    'NetworkIn',
    'NetworkOut',
    'DiskReadOps',
    'DiskWriteOps',
    'MemoryUtilization'
  ]);

  // Fetch resources when the component mounts or when the environment changes
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real implementation, we would fetch this from an API
        // For now, we'll use mock data
        const mockResources: ResourceOption[] = [
          {
            id: 'i-1234567890abcdef0',
            name: 'Web Server',
            type: 'EC2',
            metrics: ['CPUUtilization', 'NetworkIn', 'NetworkOut', 'DiskReadOps', 'DiskWriteOps', 'MemoryUtilization']
          },
          {
            id: 'i-0987654321fedcba0',
            name: 'Application Server',
            type: 'EC2',
            metrics: ['CPUUtilization', 'NetworkIn', 'NetworkOut', 'DiskReadOps', 'DiskWriteOps', 'MemoryUtilization']
          },
          {
            id: 'db-1234567890abcdef0',
            name: 'Main Database',
            type: 'RDS',
            metrics: ['CPUUtilization', 'DatabaseConnections', 'FreeStorageSpace', 'ReadIOPS', 'WriteIOPS']
          },
          {
            id: 'arn:aws:lambda:us-east-1:123456789012:function:ProcessOrders',
            name: 'Process Orders',
            type: 'Lambda',
            metrics: ['Invocations', 'Errors', 'Duration', 'Throttles', 'ConcurrentExecutions']
          }
        ];
        
        setResources(mockResources);
        
        // Set default selected resource
        if (mockResources.length > 0 && !selectedResource) {
          setSelectedResource(mockResources[0].id);
          setResourceType(mockResources[0].type);
          setAvailableMetrics(mockResources[0].metrics);
          
          // Set dimension name and namespace based on resource type
          updateDimensionAndNamespace(mockResources[0].type);
        }
      } catch (e: any) {
        console.error('Error fetching resources:', e);
        setError(e.message || 'Failed to fetch resources');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResources();
  }, [currentEnv.id]);
  
  // Update dimension name and namespace when resource type changes
  const updateDimensionAndNamespace = (type: string) => {
    switch (type) {
      case 'EC2':
        setDimensionName('InstanceId');
        setNamespace('AWS/EC2');
        break;
      case 'RDS':
        setDimensionName('DBInstanceIdentifier');
        setNamespace('AWS/RDS');
        break;
      case 'Lambda':
        setDimensionName('FunctionName');
        setNamespace('AWS/Lambda');
        break;
      default:
        setDimensionName('InstanceId');
        setNamespace('AWS/EC2');
    }
  };
  
  // Handle resource selection change
  const handleResourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const resourceId = e.target.value;
    setSelectedResource(resourceId);
    
    // Find the selected resource
    const resource = resources.find(r => r.id === resourceId);
    if (resource) {
      setResourceType(resource.type);
      setAvailableMetrics(resource.metrics);
      updateDimensionAndNamespace(resource.type);
      
      // Set default metric if the current one is not available
      if (!resource.metrics.includes(selectedMetric)) {
        setSelectedMetric(resource.metrics[0]);
      }
    }
  };

  return (
    <main className="p-8 bg-gray-50 min-h-full dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Predictive Analytics</h1>
        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800">
          Environment: {currentEnv.name} ({currentEnv.region})
        </div>
      </div>
      
      {/* Controls */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6 dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-800 mb-4 dark:text-gray-200">Configure Prediction</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Resource Selection */}
          <div>
            <label htmlFor="resource" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              Resource
            </label>
            <select
              id="resource"
              value={selectedResource}
              onChange={handleResourceChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            >
              {resources.map(resource => (
                <option key={resource.id} value={resource.id}>
                  {resource.name} ({resource.type})
                </option>
              ))}
            </select>
          </div>
          
          {/* Metric Selection */}
          <div>
            <label htmlFor="metric" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              Metric
            </label>
            <select
              id="metric"
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            >
              {availableMetrics.map(metric => (
                <option key={metric} value={metric}>
                  {metric}
                </option>
              ))}
            </select>
          </div>
          
          {/* Historical Data Range */}
          <div>
            <label htmlFor="daysBack" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              Historical Data (days)
            </label>
            <select
              id="daysBack"
              value={daysBack}
              onChange={(e) => setDaysBack(parseInt(e.target.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            >
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
            </select>
          </div>
          
          {/* Prediction Horizon */}
          <div>
            <label htmlFor="predictionHours" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              Prediction Horizon (hours)
            </label>
            <select
              id="predictionHours"
              value={predictionHours}
              onChange={(e) => setPredictionHours(parseInt(e.target.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            >
              <option value={12}>12 hours</option>
              <option value={24}>24 hours</option>
              <option value={48}>48 hours</option>
              <option value={72}>72 hours</option>
              <option value={168}>7 days (168 hours)</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 dark:bg-blue-900 dark:border-blue-800">
        <div className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 mt-0.5 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-blue-700 font-medium dark:text-blue-300">
              Powered by Amazon SageMaker
            </p>
            <p className="mt-1 text-blue-600 text-sm dark:text-blue-400">
              This predictive analytics feature uses machine learning to forecast future resource utilization based on historical patterns.
              The model analyzes time-series data from CloudWatch and identifies trends, seasonality, and anomalies to make accurate predictions.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <a 
                href="https://docs.aws.amazon.com/sagemaker/latest/dg/deepar.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-700 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                DeepAR Forecasting Algorithm
              </a>
              <a 
                href="https://docs.aws.amazon.com/sagemaker/latest/dg/canvas-time-series.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-700 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Time Series Forecasting
              </a>
              <a 
                href="https://docs.aws.amazon.com/sagemaker/latest/dg/inference-pipeline-real-time.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-700 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Real-time Inference
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Predictive Chart */}
      {loading ? (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm h-96 flex items-center justify-center dark:bg-gray-800 dark:border-gray-700">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading resources...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-white p-6 rounded-lg border border-red-200 shadow-sm dark:bg-gray-800 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      ) : selectedResource ? (
        <PredictiveChart
          title={`${selectedMetric} Forecast`}
          metric={selectedMetric}
          namespace={namespace}
          dimensionName={dimensionName}
          dimensionValue={selectedResource}
          daysBack={daysBack}
          predictionHours={predictionHours}
          environment={currentEnv.id}
          height={500}
        />
      ) : (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm h-96 flex items-center justify-center dark:bg-gray-800 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">Select a resource to view predictions</p>
        </div>
      )}
      
      {/* Additional Information */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* How It Works */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-800 mb-3 dark:text-gray-200">How It Works</h3>
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <span className="font-medium text-gray-700 dark:text-gray-300">1. Data Collection:</span> Historical metrics are collected from CloudWatch for the selected resource and time period.
            </p>
            <p>
              <span className="font-medium text-gray-700 dark:text-gray-300">2. Model Training:</span> A time-series forecasting model is trained on the historical data using Amazon SageMaker.
            </p>
            <p>
              <span className="font-medium text-gray-700 dark:text-gray-300">3. Pattern Recognition:</span> The model identifies patterns, trends, seasonality, and anomalies in the data.
            </p>
            <p>
              <span className="font-medium text-gray-700 dark:text-gray-300">4. Prediction Generation:</span> Future values are predicted based on the learned patterns and current trends.
            </p>
            <p>
              <span className="font-medium text-gray-700 dark:text-gray-300">5. Visualization:</span> Both historical data and predictions are displayed on the chart, with a clear indication of where predictions begin.
            </p>
          </div>
        </div>
        
        {/* Use Cases */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-800 mb-3 dark:text-gray-200">Use Cases</h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><span className="font-medium text-gray-700 dark:text-gray-300">Capacity Planning:</span> Predict future resource needs to plan infrastructure scaling.</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><span className="font-medium text-gray-700 dark:text-gray-300">Cost Optimization:</span> Forecast usage to optimize instance types and reserved capacity.</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><span className="font-medium text-gray-700 dark:text-gray-300">Proactive Scaling:</span> Set up auto-scaling based on predicted demand rather than reactive triggers.</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><span className="font-medium text-gray-700 dark:text-gray-300">Anomaly Prevention:</span> Identify potential future anomalies before they occur.</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><span className="font-medium text-gray-700 dark:text-gray-300">Maintenance Planning:</span> Schedule maintenance during predicted low-usage periods.</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
