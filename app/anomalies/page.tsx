"use client";

import { useState } from 'react';

interface Anomaly {
  id: number;
  resource: string;
  status: string;
  enabled: boolean;
}

export default function AnomaliesPage() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([
    { id: 1, resource: 'EC2: WebServer1', status: 'Normal', enabled: true },
    { id: 2, resource: 'RDS: MyDatabase', status: 'Warning', enabled: true },
    { id: 3, resource: 'EKS: K8sCluster', status: 'Critical', enabled: false },
  ]);
  
  const toggleAnomaly = (id: number, enabled: boolean) => {
    setAnomalies(anomalies.map(anomaly => 
      anomaly.id === id ? { ...anomaly, enabled } : anomaly
    ));
  };

  return (
    <main className="p-8 bg-gray-50 min-h-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Anomaly Detection</h1>
      <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Resource</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {anomalies.map(a => (
              <tr key={a.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3 text-sm text-gray-700">{a.resource}</td>
                <td className="p-3 text-sm text-gray-700">{a.status}</td>
                <td className="p-3 text-sm space-x-2">
                  {!a.enabled ? (
                    <button 
                      onClick={() => toggleAnomaly(a.id, true)}
                      className="text-blue-600 hover:underline"
                    >
                      Enable
                    </button>
                  ) : (
                    <button 
                      onClick={() => toggleAnomaly(a.id, false)}
                      className="text-red-600 hover:underline"
                    >
                      Disable
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
