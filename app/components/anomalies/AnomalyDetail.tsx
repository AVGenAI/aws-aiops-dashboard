"use client";

import { useState } from 'react';

interface AnomalyDetailProps {
  anomaly: {
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
  };
  onToggle: (id: string, enabled: boolean) => void;
}

export default function AnomalyDetail({ anomaly, onToggle }: AnomalyDetailProps) {
  const [expanded, setExpanded] = useState(false);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Function to generate AWS console URLs for different resource types
  const getResourceConsoleUrl = (resource: string, resourceType: string): string => {
    // Extract the service and resource name
    const [service, resourceName] = resource.split(': ');
    
    // Default region - in a real app, this would come from configuration
    const region = 'us-east-1';
    
    switch (service.toLowerCase()) {
      case 'lambda':
        return `https://console.aws.amazon.com/lambda/home?region=${region}#/functions/${resourceName}`;
      case 'ec2':
        return `https://console.aws.amazon.com/ec2/v2/home?region=${region}#Instances:instanceId=${resourceName}`;
      case 'rds':
        return `https://console.aws.amazon.com/rds/home?region=${region}#database:id=${resourceName}`;
      case 'dynamodb':
        return `https://console.aws.amazon.com/dynamodb/home?region=${region}#tables:selected=${resourceName}`;
      case 'eks':
        return `https://console.aws.amazon.com/eks/home?region=${region}#/clusters/${resourceName}`;
      case 'ecs':
        return `https://console.aws.amazon.com/ecs/home?region=${region}#/clusters/${resourceName}`;
      case 'api gateway':
      case 'apigateway':
        return `https://console.aws.amazon.com/apigateway/home?region=${region}#/apis/${resourceName}`;
      case 'cloudfront':
        return `https://console.aws.amazon.com/cloudfront/home?region=${region}#distribution-settings:${resourceName}`;
      case 'step functions':
      case 'stepfunctions':
        return `https://console.aws.amazon.com/states/home?region=${region}#/statemachines/view/${resourceName}`;
      case 'appsync':
        return `https://console.aws.amazon.com/appsync/home?region=${region}#/${resourceName}`;
      default:
        // For unknown services, link to the AWS console home
        return `https://console.aws.amazon.com/console/home?region=${region}`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critical':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'Warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Normal':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getResourceTypeIcon = (resourceType: string) => {
    switch (resourceType) {
      case 'logs':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'metrics':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
        );
      case 'traces':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
      <div className="flex items-start">
        <div className="mr-3 mt-1 text-gray-500">
          {getResourceTypeIcon(anomaly.resourceType)}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-800">
              <a 
                href={getResourceConsoleUrl(anomaly.resource, anomaly.resourceType)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-blue-600 hover:underline"
              >
                {anomaly.resource}
              </a>
            </h3>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(anomaly.status)}`}>
              {anomaly.status}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mt-1">{anomaly.details.description}</p>
          
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span>Detected: {formatTimestamp(anomaly.timestamp)}</span>
            <span>Confidence: {(anomaly.score * 100).toFixed(0)}%</span>
          </div>
          
          <div className="mt-3 flex justify-between items-center">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-blue-600 hover:underline flex items-center"
            >
              {expanded ? 'Hide details' : 'Show details'}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ml-1 transform ${expanded ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => onToggle(anomaly.id, !anomaly.enabled)}
              className={`px-3 py-1 rounded text-xs font-medium ${
                anomaly.enabled
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {anomaly.enabled ? 'Disable' : 'Enable'}
            </button>
          </div>
          
          {expanded && (
            <div className="mt-4 border-t border-gray-200 pt-3">
              {anomaly.resourceType === 'logs' && anomaly.details.logPatterns && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Log Patterns</h4>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200 text-xs font-mono">
                    {anomaly.details.logPatterns.map((pattern, index) => (
                      <div key={index} className="mb-1 last:mb-0">
                        <a 
                          href={`https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#logsV2:logs-insights?queryDetail=~(end~0~start~-3600~timeType~'RELATIVE~unit~'seconds~editorString~'${encodeURIComponent(pattern)}')`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {pattern}
                        </a>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-right">
                    <a 
                      href="https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#logsV2:logs-insights" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Open in CloudWatch Logs Insights →
                    </a>
                  </div>
                </div>
              )}
              
              {anomaly.resourceType === 'metrics' && anomaly.details.affectedMetrics && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Affected Metrics</h4>
                  <div className="flex flex-wrap gap-2">
                    {anomaly.details.affectedMetrics.map((metric, index) => (
                      <a 
                        key={index} 
                        href={`https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#metricsV2:graph=~(metrics~(~(~'AWS*2f*${metric.split(':')[0]}~'${metric.split(':')[1] || metric})))`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100 transition-colors"
                      >
                        {metric}
                      </a>
                    ))}
                  </div>
                  <div className="mt-2 text-right">
                    <a 
                      href="https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#metricsV2:graph=~()" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Open in CloudWatch Metrics →
                    </a>
                  </div>
                </div>
              )}
              
              {anomaly.resourceType === 'traces' && anomaly.details.traceIds && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Trace IDs</h4>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200 text-xs font-mono">
                    {anomaly.details.traceIds.map((traceId, index) => (
                      <div key={index} className="mb-1 last:mb-0">
                        <a 
                          href={`https://console.aws.amazon.com/xray/home?region=us-east-1#/traces/${traceId}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {traceId}
                        </a>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-right">
                    <a 
                      href="https://console.aws.amazon.com/xray/home?region=us-east-1#/traces" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Open in X-Ray Traces →
                    </a>
                  </div>
                </div>
              )}
              
              {/* Root Cause Analysis (Bedrock) */}
              {anomaly.details.rootCause && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Root Cause Analysis</h4>
                  <p className="text-xs text-gray-600 bg-yellow-50 p-3 rounded border border-yellow-200">
                    {anomaly.details.rootCause}
                  </p>
                </div>
              )}
              
              {/* Remediation Steps (Bedrock) */}
              {anomaly.details.remediation && anomaly.details.remediation.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Recommended Remediation</h4>
                  <ul className="list-disc list-inside text-xs text-gray-600 space-y-1 bg-green-50 p-3 rounded border border-green-200">
                    {anomaly.details.remediation.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* LLM Analysis (Bedrock) */}
              {anomaly.details.llmAnalysis && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">AI Analysis</h4>
                  <div className="bg-blue-50 p-3 rounded border border-blue-200 text-xs text-gray-700">
                    <p>{anomaly.details.llmAnalysis}</p>
                    {anomaly.model && (
                      <p className="mt-2 text-blue-600 text-right italic">
                        — Analysis by {anomaly.model}
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Generic Recommended Actions (if no specific remediation) */}
              {(!anomaly.details.remediation || anomaly.details.remediation.length === 0) && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Recommended Actions</h4>
                  <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                    <li>Investigate the {anomaly.resourceType} for the affected resource</li>
                    <li>Check recent deployments or configuration changes</li>
                    <li>Review related resources for similar patterns</li>
                    {anomaly.status === 'Critical' && (
                      <li className="text-red-600 font-medium">Consider immediate remediation</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
