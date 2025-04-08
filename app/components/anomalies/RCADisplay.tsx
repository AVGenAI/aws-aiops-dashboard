"use client";

import React from 'react';

// Define type for RCA trigger details (matching AnomaliesPage)
interface AnomalyRCADetails {
  timestamp: string;
  value: number;
  metric: string;
  status: 'Critical' | 'Warning';
  resourceId?: string; 
}

// Define type for RCA result (matching AnomaliesPage)
interface RCAResult {
  isLoading: boolean;
  error: string | null;
  analysis: {
    rootCause: string;
    evidence: string[];
    suggestions: string[];
  } | null;
}

interface RCADisplayProps {
  anomalyDetails: AnomalyRCADetails;
  rcaResult: RCAResult;
  onClose: () => void;
}

export default function RCADisplay({ anomalyDetails, rcaResult, onClose }: RCADisplayProps) {
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-300 shadow-md dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Root Cause Analysis</h4>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close RCA Panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Anomaly Summary */}
      <div className="mb-4 p-3 bg-white rounded border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Anomaly Detected:</p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          <strong>Metric:</strong> {anomalyDetails.metric} <br />
          <strong>Resource ID:</strong> {anomalyDetails.resourceId || 'N/A'} <br />
          <strong>Timestamp:</strong> {new Date(anomalyDetails.timestamp).toLocaleString()} <br />
          <strong>Value:</strong> {anomalyDetails.value.toFixed(2)} <br />
          <strong>Status:</strong> <span className={anomalyDetails.status === 'Critical' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}>{anomalyDetails.status}</span>
        </p>
      </div>

      {/* Analysis Results */}
      {rcaResult.isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Analyzing root cause...</p>
          </div>
        </div>
      ) : rcaResult.error ? (
        <div className="p-3 bg-red-50 border border-red-300 text-red-700 rounded dark:bg-red-900/20 dark:border-red-700 dark:text-red-300">
          <p className="font-medium text-sm">Error during analysis:</p>
          <p className="text-xs mt-1">{rcaResult.error}</p>
        </div>
      ) : rcaResult.analysis ? (
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Potential Root Cause:</p>
            <p className="text-xs bg-white p-2 rounded border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">{rcaResult.analysis.rootCause}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Supporting Evidence:</p>
            <ul className="list-disc list-inside text-xs bg-white p-2 rounded border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 space-y-1">
              {rcaResult.analysis.evidence.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Suggested Actions:</p>
            <ul className="list-disc list-inside text-xs bg-white p-2 rounded border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 space-y-1">
              {rcaResult.analysis.suggestions.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
         <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-4">Analysis complete. No specific cause identified based on available data.</p>
      )}
    </div>
  );
}
