"use client";

import { useState, useEffect } from 'react';

interface Resource {
  id: string;
  type: string;
  name: string;
  status: string;
}

export default function DiscoverPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResources() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/discover');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setResources(data);
      } catch (e: any) {
        setError(e.message || 'Failed to fetch resources');
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchResources();
  }, []);

  return (
    <main className="p-8 bg-gray-50 min-h-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Discover Resources</h1>
      <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
        {loading && <p className="text-center text-gray-500">Loading resources...</p>}
        {error && <p className="text-center text-red-600">Error: {error}</p>}
        {!loading && !error && (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Type</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Name</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">ID/Identifier</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {resources.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-3 text-center text-gray-500">No resources found.</td>
                </tr>
              ) : (
                resources.map(r => (
                  <tr key={`${r.type}-${r.id}`} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3 text-sm text-gray-700">{r.type}</td>
                    <td className="p-3 text-sm text-gray-700">{r.name}</td>
                    <td className="p-3 text-sm text-gray-700">{r.id}</td>
                    <td className="p-3 text-sm text-gray-700">{r.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
