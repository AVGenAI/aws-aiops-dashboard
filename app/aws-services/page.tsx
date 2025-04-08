"use client";

import { useState } from 'react';
import { useEnvironment } from '../context/EnvironmentContext';
import CloudWatchMetrics from '../components/aws/CloudWatchMetrics';

export default function AwsServicesPage() {
  const { currentEnv } = useEnvironment();
  const [selectedService, setSelectedService] = useState<'ec2' | 'rds' | 'lambda'>('ec2');
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  
  // Mock resources for each service
  const resources = {
    ec2: [
      { id: 'i-1234567890abcdef0', name: 'Web Server', type: 't3.medium' },
      { id: 'i-0987654321fedcba0', name: 'Application Server', type: 't3.large' },
      { id: 'i-abcdef1234567890', name: 'Database Server', type: 'm5.large' }
    ],
    rds: [
      { id: 'db-1234567890abcdef0', name: 'Production DB', type: 'db.m5.large' },
      { id: 'db-0987654321fedcba0', name: 'Staging DB', type: 'db.t3.medium' }
    ],
    lambda: [
      { id: 'function-1234567890abcdef0', name: 'API Handler', runtime: 'nodejs18.x' },
      { id: 'function-0987654321fedcba0', name: 'Image Processor', runtime: 'python3.9' },
      { id: 'function-abcdef1234567890', name: 'Data Transformer', runtime: 'nodejs18.x' },
      { id: 'function-fedcba0987654321', name: 'Notification Sender', runtime: 'python3.9' }
    ]
  };
  
  // Get namespace for the selected service
  const getNamespace = () => {
    switch (selectedService) {
      case 'ec2': return 'AWS/EC2';
      case 'rds': return 'AWS/RDS';
      case 'lambda': return 'AWS/Lambda';
      default: return 'AWS/EC2';
    }
  };
  
  // Get metric names for the selected service
  const getMetricNames = () => {
    switch (selectedService) {
      case 'ec2':
        return ['CPUUtilization', 'NetworkIn', 'NetworkOut', 'DiskReadBytes', 'DiskWriteBytes'];
      case 'rds':
        return ['CPUUtilization', 'DatabaseConnections', 'FreeStorageSpace', 'ReadIOPS', 'WriteIOPS'];
      case 'lambda':
        return ['Invocations', 'Errors', 'Duration', 'Throttles', 'ConcurrentExecutions'];
      default:
        return ['CPUUtilization'];
    }
  };
  
  return (
    <main className="p-8 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">AWS Services Dashboard</h1>
        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200">
          Environment: {currentEnv.name} ({currentEnv.region})
        </div>
      </div>
      
      {/* Service Selection */}
      <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Select AWS Service</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setSelectedService('ec2');
              setSelectedResourceId(null);
            }}
            className={`px-4 py-2 rounded-md ${
              selectedService === 'ec2'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            EC2
          </button>
          <button
            onClick={() => {
              setSelectedService('rds');
              setSelectedResourceId(null);
            }}
            className={`px-4 py-2 rounded-md ${
              selectedService === 'rds'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            RDS
          </button>
          <button
            onClick={() => {
              setSelectedService('lambda');
              setSelectedResourceId(null);
            }}
            className={`px-4 py-2 rounded-md ${
              selectedService === 'lambda'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Lambda
          </button>
        </div>
      </div>
      
      {/* Resource Selection */}
      <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Select Resource</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => setSelectedResourceId(null)}
            className={`p-4 rounded-lg border ${
              selectedResourceId === null
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="font-medium text-gray-800">All Resources</div>
            <div className="text-sm text-gray-500">View metrics for all resources</div>
          </button>
          
          {resources[selectedService].map(resource => (
            <button
              key={resource.id}
              onClick={() => setSelectedResourceId(resource.id)}
              className={`p-4 rounded-lg border ${
                selectedResourceId === resource.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium text-gray-800">{resource.name}</div>
              <div className="text-sm text-gray-500">
                {selectedService === 'lambda'
                  ? `Runtime: ${(resource as { runtime: string }).runtime}`
                  : `Type: ${(resource as { type: string }).type}`}
              </div>
              <div className="text-xs text-gray-400 mt-1">{resource.id}</div>
            </button>
          ))}
        </div>
      </div>
      
      {/* CloudWatch Metrics */}
      <CloudWatchMetrics
        namespace={getNamespace()}
        metricNames={getMetricNames()}
        resourceId={selectedResourceId || undefined}
      />
      
      {/* Information Box */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
        <div className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-medium">
              AWS Services Integration
            </p>
            <p className="mt-1">
              This dashboard provides real-time monitoring of your AWS resources across multiple services.
              Select a service and resource to view detailed metrics and performance data.
              All metrics are retrieved from Amazon CloudWatch and updated in real-time.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <a 
                href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs underline hover:text-blue-800"
              >
                CloudWatch Documentation
              </a>
              <a 
                href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs underline hover:text-blue-800"
              >
                AWS Services Metrics
              </a>
              <a 
                href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs underline hover:text-blue-800"
              >
                CloudWatch Concepts
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
