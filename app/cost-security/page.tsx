"use client";

import { useState, useEffect } from 'react';

interface CostData {
  currentMonth: {
    amount: string;
    unit: string;
  };
  forecast: {
    amount: string;
    unit: string;
  };
  period: {
    start: string;
    end: string;
  };
}

interface SecurityFinding {
  id: string;
  title: string;
  description: string;
  severity: string;
  resourceType: string;
  resourceId: string;
}

interface SecurityData {
  findings: SecurityFinding[];
  counts: {
    CRITICAL: number;
    HIGH: number;
    MEDIUM: number;
    LOW: number;
    INFORMATIONAL: number;
  };
  total: number;
}

export default function CostSecurityPage() {
  const [costData, setCostData] = useState<CostData | null>(null);
  const [securityData, setSecurityData] = useState<SecurityData | null>(null);
  const [loading, setLoading] = useState({ cost: true, security: true });
  const [error, setError] = useState({ cost: null as string | null, security: null as string | null });

  // Fetch cost data
  useEffect(() => {
    async function fetchCostData() {
      try {
        setLoading(prev => ({ ...prev, cost: true }));
        const response = await fetch('/api/cost');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setCostData(data);
      } catch (e: any) {
        setError(prev => ({ ...prev, cost: e.message || 'Failed to fetch cost data' }));
        console.error(e);
      } finally {
        setLoading(prev => ({ ...prev, cost: false }));
      }
    }
    fetchCostData();
  }, []);

  // Fetch security data
  useEffect(() => {
    async function fetchSecurityData() {
      try {
        setLoading(prev => ({ ...prev, security: true }));
        const response = await fetch('/api/security');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setSecurityData(data);
      } catch (e: any) {
        setError(prev => ({ ...prev, security: e.message || 'Failed to fetch security data' }));
        console.error(e);
      } finally {
        setLoading(prev => ({ ...prev, security: false }));
      }
    }
    fetchSecurityData();
  }, []);

  // Helper function to get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-700 bg-red-100';
      case 'HIGH': return 'text-orange-700 bg-orange-100';
      case 'MEDIUM': return 'text-yellow-700 bg-yellow-100';
      case 'LOW': return 'text-blue-700 bg-blue-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <main className="p-8 bg-gray-50 min-h-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Cost & Security Insights</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Cost Summary Card */}
        <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Cost Summary</h2>
          {loading.cost && <p className="text-center text-gray-500">Loading cost data...</p>}
          {error.cost && <p className="text-center text-red-600">Error: {error.cost}</p>}
          {!loading.cost && !error.cost && costData && (
            <div>
              <div className="mb-4">
                <p className="text-sm text-gray-600">Current month spending:</p>
                <p className="text-2xl font-bold text-blue-600">{costData.currentMonth.unit} {costData.currentMonth.amount}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600">Forecasted total:</p>
                <p className="text-xl font-semibold">{costData.forecast.unit} {costData.forecast.amount}</p>
              </div>
              <p className="text-xs text-gray-500">Period: {costData.period.start} to {costData.period.end}</p>
              <a 
                href="https://console.aws.amazon.com/cost-management/home#/cost-explorer" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-3 text-sm text-blue-600 hover:underline inline-block"
              >
                View Cost Explorer
              </a>
            </div>
          )}
        </div>

        {/* Security Findings Card */}
        <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Security Findings</h2>
          {loading.security && <p className="text-center text-gray-500">Loading security data...</p>}
          {error.security && <p className="text-center text-red-600">Error: {error.security}</p>}
          {!loading.security && !error.security && securityData && (
            <div>
              <div className="flex justify-between mb-4">
                <div className="text-center px-3 py-2">
                  <p className="text-xs text-gray-600">Critical</p>
                  <p className="text-xl font-bold text-red-600">{securityData.counts.CRITICAL}</p>
                </div>
                <div className="text-center px-3 py-2">
                  <p className="text-xs text-gray-600">High</p>
                  <p className="text-xl font-bold text-orange-600">{securityData.counts.HIGH}</p>
                </div>
                <div className="text-center px-3 py-2">
                  <p className="text-xs text-gray-600">Medium</p>
                  <p className="text-xl font-bold text-yellow-600">{securityData.counts.MEDIUM}</p>
                </div>
                <div className="text-center px-3 py-2">
                  <p className="text-xs text-gray-600">Low</p>
                  <p className="text-xl font-bold text-blue-600">{securityData.counts.LOW}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">Total findings: {securityData.total}</p>
              <a 
                href="https://console.aws.amazon.com/securityhub/home" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-1 text-sm text-blue-600 hover:underline inline-block"
              >
                View Security Hub
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Security Findings Table */}
      <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Recent Security Findings</h2>
        {loading.security && <p className="text-center text-gray-500">Loading findings...</p>}
        {error.security && <p className="text-center text-red-600">Error: {error.security}</p>}
        {!loading.security && !error.security && securityData && (
          securityData.findings.length === 0 ? (
            <p className="text-center text-gray-500">No security findings.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Severity</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Title</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600">Resource</th>
                </tr>
              </thead>
              <tbody>
                {securityData.findings.map(finding => (
                  <tr key={finding.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getSeverityColor(finding.severity)}`}>
                        {finding.severity}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-700">{finding.title}</td>
                    <td className="p-3 text-sm text-gray-700">{finding.resourceType}: {finding.resourceId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    </main>
  );
}
