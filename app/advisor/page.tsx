"use client";

import { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import { useEnvironment } from '../context/EnvironmentContext';

interface Recommendation {
  id: string;
  category: 'cost' | 'performance' | 'security' | 'fault-tolerance' | 'service-limits';
  title: string;
  description: string;
  status: 'ok' | 'warning' | 'error' | 'not-available';
  resourcesAffected: number;
  estimatedMonthlySavings?: number;
}

interface AdvisorData {
  recommendations: Recommendation[];
  summary: {
    costSavings: number;
    securityIssues: number;
    faultToleranceWarnings: number;
    serviceLimitsWarnings: number;
  };
}

export default function AdvisorPage() {
  const { currentEnv } = useEnvironment();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AdvisorData | null>(null);
  
  // Fetch data when the component mounts or when the environment changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/advisor?environment=${currentEnv.id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setData(data);
      } catch (e: any) {
        console.error('Error fetching advisor data:', e);
        setError(e.message || 'Failed to fetch advisor data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentEnv.id]);
  
  // Use the fetched recommendations or an empty array if data is not loaded yet
  const recommendations = data?.recommendations || [];

  // Loading state
  if (loading) {
    return (
      <main className="p-8 bg-gray-50 min-h-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Trusted Advisor</h1>
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200">
            Environment: {currentEnv.name} ({currentEnv.region})
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-gray-600">Loading recommendations for {currentEnv.name}...</p>
          </div>
        </div>
      </main>
    );
  }
  
  // Error state
  if (error) {
    return (
      <main className="p-8 bg-gray-50 min-h-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Trusted Advisor</h1>
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200">
            Environment: {currentEnv.name} ({currentEnv.region})
          </div>
        </div>
        <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-lg">
          <p className="font-medium">Error loading recommendations</p>
          <p className="text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }
  
  const categories = [
    { id: 'all', name: 'All Checks', icon: 'dashboard' },
    { id: 'cost', name: 'Cost Optimization', icon: 'cost' },
    { id: 'performance', name: 'Performance', icon: 'cloudwatch' },
    { id: 'security', name: 'Security', icon: 'security' },
    { id: 'fault-tolerance', name: 'Fault Tolerance', icon: 'health' },
    { id: 'service-limits', name: 'Service Limits', icon: 'cloudformation' }
  ];

  const filteredRecommendations = activeCategory === 'all'
    ? recommendations
    : recommendations.filter(rec => rec.category === activeCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return 'bg-green-100 text-green-700 border-green-300';
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'error': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ok': return 'OK';
      case 'warning': return 'Warning';
      case 'error': return 'Error';
      default: return 'Not Available';
    }
  };

  const totalSavings = data?.summary.costSavings || 0;

  return (
    <main className="p-8 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Trusted Advisor</h1>
        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200">
          Environment: {currentEnv.name} ({currentEnv.region})
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Cost Optimization</h3>
          <div className="flex justify-between items-end">
            <p className="text-2xl font-bold text-green-600">${totalSavings.toFixed(2)}</p>
            <p className="text-xs text-gray-500">Estimated Monthly Savings</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Security</h3>
          <div className="flex justify-between items-end">
            <p className="text-2xl font-bold text-red-600">{data?.summary.securityIssues}</p>
            <p className="text-xs text-gray-500">Issues Detected</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Fault Tolerance</h3>
          <div className="flex justify-between items-end">
            <p className="text-2xl font-bold text-yellow-600">{data?.summary.faultToleranceWarnings}</p>
            <p className="text-xs text-gray-500">Warnings</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Service Limits</h3>
          <div className="flex justify-between items-end">
            <p className="text-2xl font-bold text-yellow-600">{data?.summary.serviceLimitsWarnings}</p>
            <p className="text-xs text-gray-500">Approaching Limits</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Categories Sidebar */}
        <div className="w-full md:w-64 bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-3">Categories</h2>
          <ul className="space-y-2">
            {categories.map(category => (
              <li key={category.id}>
                <button
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm flex items-center ${
                    activeCategory === category.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <Icon service={category.icon} className="mr-2" />
                  <span>{category.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendations List */}
        <div className="flex-1">
          <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
            <h2 className="font-semibold text-gray-700 mb-4">
              {activeCategory === 'all' ? 'All Recommendations' : categories.find(c => c.id === activeCategory)?.name}
            </h2>
            
            <div className="space-y-4">
              {filteredRecommendations.map(rec => (
                <div key={rec.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start">
                    <div className="mr-3">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(rec.status)}`}>
                        {getStatusText(rec.status)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 mb-1">{rec.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Resources affected: {rec.resourcesAffected}</span>
                        {rec.estimatedMonthlySavings && (
                          <span className="text-xs text-green-600 font-medium">
                            Est. savings: ${rec.estimatedMonthlySavings.toFixed(2)}/month
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredRecommendations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No recommendations found for this category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
