"use client";

import { useState, useEffect } from 'react';
import { useEnvironment } from '../context/EnvironmentContext';
import AnomalyDetail from '../components/anomalies/AnomalyDetail';

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
type BedrockModel = 'anthropic.claude-v2' | 'anthropic.claude-instant-v1' | 'amazon.titan-text-express-v1';

export default function AnomaliesPage() {
  const { currentEnv } = useEnvironment();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [activeTab, setActiveTab] = useState<'logs' | 'metrics' | 'traces'>('logs');
  const [aiService, setAiService] = useState<AiService>('sagemaker');
  const [bedrockModel, setBedrockModel] = useState<BedrockModel>('anthropic.claude-v2');
  
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
                <select
                  id="bedrockModel"
                  value={bedrockModel}
                  onChange={(e) => setBedrockModel(e.target.value as BedrockModel)}
                  className="block w-48 pl-3 pr-10 py-1 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                >
                  <option value="anthropic.claude-v2">Claude V2</option>
                  <option value="anthropic.claude-instant-v1">Claude Instant</option>
                  <option value="amazon.titan-text-express-v1">Amazon Titan</option>
                </select>
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
                    href={`https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-${bedrockModel.includes('claude') ? 'claude' : 'titan'}.html`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs underline hover:text-purple-800"
                  >
                    {bedrockModel.split('.')[1]} Parameters
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
    </main>
  );
}
