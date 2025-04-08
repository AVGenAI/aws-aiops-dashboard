"use client";

import { useState, useEffect } from 'react';
import { useEnvironment } from '../context/EnvironmentContext';
import AnomalyDetail from '../components/anomalies/AnomalyDetail';
import TimeSeriesChart from '../components/anomalies/TimeSeriesChart';
import ResourceHeatmap from '../components/anomalies/ResourceHeatmap';
import AnomalyCorrelation from '../components/anomalies/AnomalyCorrelation';

interface Anomaly {
  id: string;
  resource: string;
  resourceType: 'logs' | 'metrics' | 'traces';
  timestamp: string;
  score: number;
  status: 'Normal' | 'Warning' | 'Critical';
  details: {
    description: string;
    affectedMetrics?: string[];
    logPatterns?: string[];
    traceIds?: string[];
    rootCause?: string;
    remediation?: string[];
    llmAnalysis?: string;
  };
  enabled: boolean;
  model?: string; // Optional field for Bedrock models
}

type AiService = 'sagemaker' | 'bedrock';
// Define the type for Bedrock models
type BedrockModel = string;

// Interface for model provider info
interface ModelProvider {
  name: string;
  models: {
    id: string;
    displayName: string;
  }[];
}

export default function AnomaliesPage() {
  const { currentEnv } = useEnvironment();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [activeTab, setActiveTab] = useState<'logs' | 'metrics' | 'traces'>('logs');
  const [aiService, setAiService] = useState<AiService>('sagemaker');
  const [bedrockModel, setBedrockModel] = useState<BedrockModel>('anthropic.claude-v2');
  const [modelProviders, setModelProviders] = useState<ModelProvider[]>([]);
  const [loadingModels, setLoadingModels] = useState<boolean>(false);
  
  // Fetch available Bedrock models when the component mounts or aiService changes to Bedrock
  useEffect(() => {
    const fetchBedrockModels = async () => {
      if (aiService !== 'bedrock') return;
      
      setLoadingModels(true);
      
      try {
        const response = await fetch('/api/bedrock-models');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setModelProviders(data.providers || []);
        
        // If we get models and current selection is not in the list, select the first available model
        if (data.providers && data.providers.length > 0) {
          const allModels = data.providers.flatMap((p: ModelProvider) => p.models);
          const modelExists = allModels.some((m: {id: string; displayName: string}) => m.id === bedrockModel);
          
          if (!modelExists && allModels.length > 0) {
            setBedrockModel(allModels[0].id);
          }
        }
      } catch (e: any) {
        console.error('Error fetching Bedrock models:', e);
        // We don't set the main error state here as this is not critical
      } finally {
        setLoadingModels(false);
      }
    };
    
    fetchBedrockModels();
  }, [aiService]);
  
  // Fetch anomalies when the component mounts or when the environment, tab, or AI service changes
  useEffect(() => {
    const fetchAnomalies = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Choose the API endpoint based on the selected AI service
        const endpoint = aiService === 'sagemaker' 
          ? `/api/anomalies?environment=${currentEnv.id}&resourceType=${activeTab}`
          : `/api/bedrock-anomalies?environment=${currentEnv.id}&resourceType=${activeTab}&model=${bedrockModel}`;
        
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setAnomalies(data.anomalies || []);
      } catch (e: any) {
        console.error(`Error fetching anomalies from ${aiService}:`, e);
        setError(e.message || `Failed to fetch anomalies from ${aiService}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnomalies();
  }, [currentEnv.id, activeTab, aiService, bedrockModel]);
  
  const toggleAnomaly = async (id: string, enabled: boolean) => {
    try {
      // Choose the API endpoint based on the selected AI service
      const endpoint = aiService === 'sagemaker' 
        ? '/api/anomalies'
        : '/api/bedrock-anomalies';
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, enabled }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Update the local state
      setAnomalies(anomalies.map(anomaly => 
        anomaly.id === id ? { ...anomaly, enabled } : anomaly
      ));
    } catch (e: any) {
      console.error('Error toggling anomaly:', e);
      // Show an error message to the user
      alert(`Failed to ${enabled ? 'enable' : 'disable'} anomaly detection: ${e.message}`);
    }
  };

  // Count anomalies by status
  const criticalCount = anomalies.filter(a => a.status === 'Critical').length;
  const warningCount = anomalies.filter(a => a.status === 'Warning').length;
  const normalCount = anomalies.filter(a => a.status === 'Normal').length;

  // State for visualizations
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '1d' | '1w' | '1m'>('1d');
  const [selectedAnomaly, setSelectedAnomaly] = useState<string | null>(null);
  const [showVisualizations, setShowVisualizations] = useState<boolean>(true);
  
  // Mock data for time series chart
  const mockTimeSeriesData = [
    { timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), value: 25, status: 'Normal' as const },
    { timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(), value: 28, status: 'Normal' as const },
    { timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), value: 32, status: 'Normal' as const },
    { timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), value: 45, status: 'Normal' as const },
    { timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(), value: 60, status: 'Warning' as const },
    { timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(), value: 75, status: 'Warning' as const },
    { timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), value: 90, status: 'Critical' as const },
    { timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), value: 85, status: 'Critical' as const },
    { timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), value: 70, status: 'Warning' as const },
    { timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), value: 55, status: 'Warning' as const },
    { timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), value: 40, status: 'Normal' as const },
    { timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), value: 35, status: 'Normal' as const },
    { timestamp: new Date().toISOString(), value: 30, status: 'Normal' as const },
  ];
  
  // Mock data for resource heatmap
  const mockResourceData = [
    { id: 'r1', name: 'API Gateway', type: 'API', x: 85, y: 40, z: 0.8, status: 'Critical' as const },
    { id: 'r2', name: 'Lambda Function', type: 'Compute', x: 70, y: 90, z: 0.7, status: 'Critical' as const },
    { id: 'r3', name: 'DynamoDB Table', type: 'Database', x: 30, y: 75, z: 0.6, status: 'Warning' as const },
    { id: 'r4', name: 'EC2 Instance', type: 'Compute', x: 60, y: 50, z: 0.5, status: 'Warning' as const },
    { id: 'r5', name: 'S3 Bucket', type: 'Storage', x: 20, y: 30, z: 0.3, status: 'Normal' as const },
    { id: 'r6', name: 'CloudFront', type: 'CDN', x: 40, y: 20, z: 0.2, status: 'Normal' as const },
    { id: 'r7', name: 'RDS Instance', type: 'Database', x: 50, y: 60, z: 0.4, status: 'Warning' as const },
    { id: 'r8', name: 'ECS Cluster', type: 'Container', x: 75, y: 80, z: 0.9, status: 'Critical' as const },
  ];
  
  // Mock data for anomaly correlation
  const mockCorrelationData = [
    { 
      name: 'High CPU Usage', 
      count: 12, 
      critical: 5, 
      warning: 4, 
      normal: 3,
      relatedTo: ['Memory Pressure', 'API Latency', 'Database Connections']
    },
    { 
      name: 'Memory Pressure', 
      count: 8, 
      critical: 3, 
      warning: 3, 
      normal: 2,
      relatedTo: ['High CPU Usage', 'Disk I/O']
    },
    { 
      name: 'API Latency', 
      count: 15, 
      critical: 7, 
      warning: 5, 
      normal: 3,
      relatedTo: ['High CPU Usage', 'Database Connections', 'Network Traffic']
    },
    { 
      name: 'Database Connections', 
      count: 10, 
      critical: 4, 
      warning: 4, 
      normal: 2,
      relatedTo: ['API Latency', 'High CPU Usage']
    },
    { 
      name: 'Disk I/O', 
      count: 6, 
      critical: 2, 
      warning: 2, 
      normal: 2,
      relatedTo: ['Memory Pressure', 'Database Connections']
    },
    { 
      name: 'Network Traffic', 
      count: 9, 
      critical: 3, 
      warning: 4, 
      normal: 2,
      relatedTo: ['API Latency', 'High CPU Usage']
    },
  ];

  return (
    <main className="p-8 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Anomaly Detection</h1>
        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200">
          Environment: {currentEnv.name} ({currentEnv.region})
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Critical Anomalies</h3>
          <div className="flex justify-between items-end">
            <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
            <p className="text-xs text-gray-500">Require immediate attention</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Warning Anomalies</h3>
          <div className="flex justify-between items-end">
            <p className="text-2xl font-bold text-yellow-600">{warningCount}</p>
            <p className="text-xs text-gray-500">Require investigation</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Resources Monitored</h3>
          <div className="flex justify-between items-end">
            <p className="text-2xl font-bold text-blue-600">{anomalies.length}</p>
            <p className="text-xs text-gray-500">
              Using {aiService === 'sagemaker' ? 'SageMaker AI' : 'Bedrock AI'}
            </p>
          </div>
        </div>
      </div>
      
      {/* AI Service Selection */}
      <div className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">AI Service for Anomaly Detection</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="sagemaker"
                name="aiService"
                value="sagemaker"
                checked={aiService === 'sagemaker'}
                onChange={() => setAiService('sagemaker')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="sagemaker" className="ml-2 block text-sm text-gray-700">
                Amazon SageMaker
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="bedrock"
                name="aiService"
                value="bedrock"
                checked={aiService === 'bedrock'}
                onChange={() => setAiService('bedrock')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="bedrock" className="ml-2 block text-sm text-gray-700">
                Amazon Bedrock
              </label>
            </div>
            
            {aiService === 'bedrock' && (
              <div className="ml-6 flex items-center">
                <label htmlFor="bedrockModel" className="block text-sm text-gray-700 mr-2">
                  Model:
                </label>
                <div className="relative">
                  {loadingModels && (
                    <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-blue-600 rounded-full"></div>
                    </div>
                  )}
                  <select
                    id="bedrockModel"
                    value={bedrockModel}
                    onChange={(e) => setBedrockModel(e.target.value as BedrockModel)}
                    className="block w-64 pl-3 pr-10 py-1 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                    disabled={loadingModels}
                  >
                    {modelProviders.length > 0 ? (
                      // Render dynamically fetched models
                      modelProviders.map((provider) => (
                        <optgroup key={provider.name} label={`${provider.name} Models`}>
                          {provider.models.map((model) => (
                            <option key={model.id} value={model.id}>
                              {model.displayName}
                            </option>
                          ))}
                        </optgroup>
                      ))
                    ) : (
                      // Fallback to hardcoded models if API fails
                      <>
                        {/* Anthropic Claude Models */}
                        <optgroup label="Anthropic Claude Models">
                          <option value="anthropic.claude-v2">Claude V2</option>
                          <option value="anthropic.claude-v2:1">Claude V2:1</option>
                          <option value="anthropic.claude-instant-v1">Claude Instant V1</option>
                          <option value="anthropic.claude-3-sonnet-20240229-v1:0">Claude 3 Sonnet</option>
                          <option value="anthropic.claude-3-haiku-20240307-v1:0">Claude 3 Haiku</option>
                          <option value="anthropic.claude-3-opus-20240229-v1:0">Claude 3 Opus</option>
                        </optgroup>
                        
                        {/* Amazon Titan Models */}
                        <optgroup label="Amazon Titan Models">
                          <option value="amazon.titan-text-express-v1">Titan Text Express</option>
                          <option value="amazon.titan-text-lite-v1">Titan Text Lite</option>
                          <option value="amazon.titan-embed-text-v1">Titan Embed Text</option>
                          <option value="amazon.titan-embed-image-v1">Titan Embed Image</option>
                          <option value="amazon.titan-image-generator-v1">Titan Image Generator</option>
                        </optgroup>
                        
                        {/* AI21 Labs Models */}
                        <optgroup label="AI21 Labs Models">
                          <option value="ai21.j2-mid-v1">Jurassic-2 Mid</option>
                          <option value="ai21.j2-ultra-v1">Jurassic-2 Ultra</option>
                          <option value="ai21.jamba-instruct-v1">Jamba Instruct</option>
                        </optgroup>
                        
                        {/* Cohere Models */}
                        <optgroup label="Cohere Models">
                          <option value="cohere.command-text-v14">Command Text</option>
                          <option value="cohere.command-light-text-v14">Command Light Text</option>
                          <option value="cohere.embed-english-v3">Embed English</option>
                          <option value="cohere.embed-multilingual-v3">Embed Multilingual</option>
                        </optgroup>
                        
                        {/* Meta Models */}
                        <optgroup label="Meta Models">
                          <option value="meta.llama2-13b-chat-v1">Llama 2 13B Chat</option>
                          <option value="meta.llama2-70b-chat-v1">Llama 2 70B Chat</option>
                          <option value="meta.llama3-8b-instruct-v1:0">Llama 3 8B Instruct</option>
                          <option value="meta.llama3-70b-instruct-v1:0">Llama 3 70B Instruct</option>
                        </optgroup>
                        
                        {/* Stability AI Models */}
                        <optgroup label="Stability AI Models">
                          <option value="stability.stable-diffusion-xl-v1">Stable Diffusion XL</option>
                          <option value="stability.stable-image-core-v1:0">Stable Image Core</option>
                          <option value="stability.stable-image-ultra-v1:0">Stable Image Ultra</option>
                        </optgroup>
                      </>
                    )}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Data Type Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'logs'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            CloudWatch Logs
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'metrics'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            CloudWatch Metrics
          </button>
          <button
            onClick={() => setActiveTab('traces')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'traces'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            X-Ray Traces
          </button>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-2"></div>
                <p className="text-gray-600">Loading anomalies...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-lg">
              <p className="font-medium">Error loading anomalies</p>
              <p className="text-sm">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          ) : anomalies.length === 0 ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500">No anomalies detected for {activeTab} in {currentEnv.name}.</p>
              <p className="text-sm text-gray-400 mt-1">All systems are operating normally.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {anomalies.map(anomaly => (
                <AnomalyDetail 
                  key={anomaly.id} 
                  anomaly={anomaly} 
                  onToggle={toggleAnomaly} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* AI Service Info Box */}
      <div className={`p-4 rounded-lg border text-sm ${
        aiService === 'sagemaker' 
          ? 'bg-blue-50 border-blue-200 text-blue-700' 
          : 'bg-purple-50 border-purple-200 text-purple-700'
      }`}>
        <div className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            {aiService === 'sagemaker' ? (
              <>
                <p className="font-medium">
                  Powered by <a 
                    href="https://aws.amazon.com/sagemaker/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-800"
                  >
                    Amazon SageMaker
                  </a>
                </p>
                <p className="mt-1">
                  Anomaly detection is performed using machine learning models trained on your AWS resource data. 
                  The models continuously learn and adapt to your environment's patterns to provide accurate anomaly detection.
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <a 
                    href="https://docs.aws.amazon.com/sagemaker/latest/dg/randomcutforest.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs underline hover:text-blue-800"
                  >
                    Random Cut Forest Algorithm
                  </a>
                  <a 
                    href="https://docs.aws.amazon.com/sagemaker/latest/dg/clarify-online-explainability.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs underline hover:text-blue-800"
                  >
                    SageMaker Clarify
                  </a>
                  <a 
                    href="https://docs.aws.amazon.com/sagemaker/latest/dg/model-monitor.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs underline hover:text-blue-800"
                  >
                    Model Monitoring
                  </a>
                </div>
              </>
            ) : (
              <>
                <p className="font-medium">
                  Powered by <a 
                    href="https://aws.amazon.com/bedrock/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline hover:text-purple-800"
                  >
                    Amazon Bedrock
                  </a> - {bedrockModel.split('.')[1]}
                </p>
                <p className="mt-1">
                  Anomaly detection is enhanced with generative AI capabilities from Amazon Bedrock. 
                  This provides deeper insights including root cause analysis, detailed remediation steps, 
                  and natural language explanations of detected anomalies.
                </p>
                <p className="mt-2 text-xs">
                  <span className="font-medium">Current model:</span> {bedrockModel}
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <a 
                    href="https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs underline hover:text-purple-800"
                  >
                    Bedrock Documentation
                  </a>
                  <a 
                    href={`https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-${
                      bedrockModel.includes('claude') ? 'claude' : 
                      bedrockModel.includes('titan') ? 'titan' :
                      bedrockModel.includes('ai21') ? 'ai21' :
                      bedrockModel.includes('cohere') ? 'cohere' :
                      bedrockModel.includes('llama') ? 'meta' :
                      bedrockModel.includes('stable') ? 'stability' : 'index'
                    }.html`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs underline hover:text-purple-800"
                  >
                    {bedrockModel.split('.')[1].split('-')[0].charAt(0).toUpperCase() + bedrockModel.split('.')[1].split('-')[0].slice(1)} Parameters
                  </a>
                  <a 
                    href="https://docs.aws.amazon.com/bedrock/latest/userguide/agents.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs underline hover:text-purple-800"
                  >
                    Bedrock Agents
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Visualizations Toggle */}
      <div className="flex justify-between items-center mt-8 mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-dark-text">Advanced Visualizations</h2>
        <button
          onClick={() => setShowVisualizations(!showVisualizations)}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
        >
          {showVisualizations ? 'Hide Visualizations' : 'Show Visualizations'}
        </button>
      </div>
      
      {showVisualizations && (
        <div className="space-y-6">
          {/* Time Series Chart */}
          <TimeSeriesChart
            data={mockTimeSeriesData}
            title="CPU Utilization Over Time"
            metric="CPU Usage"
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
          
          {/* Resource Heatmap */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResourceHeatmap
              data={mockResourceData}
              title="Resource Utilization Heatmap"
              xMetric="CPU Utilization"
              yMetric="Memory Utilization"
            />
            
            {/* Anomaly Correlation */}
            <AnomalyCorrelation
              data={mockCorrelationData}
              title="Anomaly Type Correlation"
              onSelectAnomaly={setSelectedAnomaly}
            />
          </div>
        </div>
      )}
    </main>
  );
}
