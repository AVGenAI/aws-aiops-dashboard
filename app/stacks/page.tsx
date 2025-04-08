"use client";

import { useState, useEffect, useCallback } from 'react';

interface Stack {
  id: string;
  name: string;
  status: string;
}

export default function StacksPage() {
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stackName, setStackName] = useState('');
  const [templateUrl, setTemplateUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStacks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/stacks');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setStacks(data);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch stacks');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStacks();
  }, [fetchStacks]);

  async function createStack() {
    if (!stackName || !templateUrl) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/stacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stackName, templateUrl }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `HTTP error! status: ${response.status}`);
      }
      setStackName('');
      setTemplateUrl('');
      // Refresh list after a short delay to allow AWS to update
      setTimeout(fetchStacks, 3000);
    } catch (e: any) {
      setError(e.message || 'Failed to create stack');
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteStack(name: string) {
    if (!confirm(`Are you sure you want to delete stack "${name}"?`)) return;
    setError(null);
    try {
      const response = await fetch(`/api/stacks/${encodeURIComponent(name)}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `HTTP error! status: ${response.status}`);
      }
      // Refresh list after a short delay
      setTimeout(fetchStacks, 3000);
    } catch (e: any) {
      setError(e.message || 'Failed to delete stack');
      console.error(e);
    }
  }

  return (
    <main className="p-8 bg-gray-50 min-h-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Stacks</h1>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">{error}</div>}

      <div className="mb-6 bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Create New Stack</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Stack Name"
            value={stackName}
            onChange={e => setStackName(e.target.value)}
            className="border border-gray-300 p-2 rounded flex-1 text-sm"
            disabled={isSubmitting}
          />
          <input
            type="text"
            placeholder="Template URL (e.g., S3 URL)"
            value={templateUrl}
            onChange={e => setTemplateUrl(e.target.value)}
            className="border border-gray-300 p-2 rounded flex-1 text-sm"
            disabled={isSubmitting}
          />
          <button
            onClick={createStack}
            className={`bg-blue-600 text-white px-4 py-2 rounded text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Stack'}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Existing Stacks</h2>
        {loading && <p className="text-center text-gray-500">Loading stacks...</p>}
        {!loading && (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Name</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stacks.length === 0 ? (
                 <tr>
                  <td colSpan={3} className="p-3 text-center text-gray-500">No stacks found.</td>
                </tr>
              ) : (
                stacks.map(stack => (
                  <tr key={stack.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3 text-sm text-gray-700">{stack.name}</td>
                    <td className="p-3 text-sm text-gray-700">{stack.status}</td>
                    <td className="p-3 text-sm space-x-2">
                      <button className="text-blue-600 hover:underline" disabled>Update</button> {/* Update not implemented */}
                      <button
                        onClick={() => deleteStack(stack.name)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
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
