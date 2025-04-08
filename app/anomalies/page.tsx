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
  };
  enabled: boolean;
}

export default function AnomaliesPage() {
  const { currentEnv } = useEnvironment();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [activeTab, setActiveTab] = useState<'logs' | 'metrics' | 'traces'>('logs');
  
  // Fetch anomalies when the component mounts or when the environment or tab changes
  useEffect(() => {
    const fetchAnomalies = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/anomalies?environment=${currentEnv.id}&resourceType=${activeTab}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setAnomalies(data.anomalies || []);
      } catch (e: any) {
        console.error('Error fetching anomalies:', e);
        setError(e.message || 'Failed to fetch anomalies');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnomalies();
  }, [currentEnv.id, activeTab]);
  
  const toggleAnomaly = async (id: string, enabled: boolean) => {
    try {
      const response = await fetch('/api/anomalies', {
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
            <p className="text-xs text-gray-500">Using SageMaker AI</p>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden mb-6">
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
      
      {/* SageMaker Integration Info */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-sm text-blue-700">
        <div className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-medium">Powered by Amazon SageMaker</p>
            <p className="mt-1">Anomaly detection is performed using machine learning models trained on your AWS resource data. The models continuously learn and adapt to your environment's patterns to provide accurate anomaly detection.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
