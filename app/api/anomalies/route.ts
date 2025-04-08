import { NextRequest, NextResponse } from 'next/server';

// Types for anomaly detection
interface AnomalyDetectionRequest {
  environment: string;
  resourceType: 'logs' | 'metrics' | 'traces';
  resourceId?: string;
  timeRange?: {
    start: string;
    end: string;
  };
}

interface AnomalyResult {
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

// Mock data for different environments and resource types
const mockAnomalies: Record<string, Record<string, AnomalyResult[]>> = {
  dev: {
    logs: [
      {
        id: 'log-1',
        resource: 'Lambda: AuthFunction',
        resourceType: 'logs',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        score: 0.87,
        status: 'Critical',
        details: {
          description: 'Unusual error pattern detected in Lambda function logs',
          logPatterns: [
            'Error: Connection timeout when connecting to authentication service',
            'Error: Failed to validate user token'
          ]
        },
        enabled: true
      },
      {
        id: 'log-2',
        resource: 'EC2: WebServer1',
        resourceType: 'logs',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        score: 0.65,
        status: 'Warning',
        details: {
          description: 'Increased rate of 404 errors in web server logs',
          logPatterns: [
            '404 NOT FOUND /api/v1/products',
            '404 NOT FOUND /api/v1/users'
          ]
        },
        enabled: true
      }
    ],
    metrics: [
      {
        id: 'metric-1',
        resource: 'RDS: MyDatabase',
        resourceType: 'metrics',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        score: 0.92,
        status: 'Critical',
        details: {
          description: 'Unusual spike in database CPU utilization',
          affectedMetrics: [
            'CPUUtilization',
            'DatabaseConnections'
          ]
        },
        enabled: true
      },
      {
        id: 'metric-2',
        resource: 'ECS: APICluster',
        resourceType: 'metrics',
        timestamp: new Date(Date.now() - 5400000).toISOString(),
        score: 0.58,
        status: 'Warning',
        details: {
          description: 'Memory utilization trending higher than normal',
          affectedMetrics: [
            'MemoryUtilization'
          ]
        },
        enabled: false
      }
    ],
    traces: [
      {
        id: 'trace-1',
        resource: 'API Gateway: UserService',
        resourceType: 'traces',
        timestamp: new Date(Date.now() - 2700000).toISOString(),
        score: 0.78,
        status: 'Warning',
        details: {
          description: 'Unusual latency in API requests to user service',
          traceIds: [
            'trace-12345-abcde',
            'trace-67890-fghij'
          ]
        },
        enabled: true
      }
    ]
  },
  uat: {
    logs: [
      {
        id: 'log-3',
        resource: 'EKS: K8sCluster',
        resourceType: 'logs',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        score: 0.75,
        status: 'Warning',
        details: {
          description: 'Pod restart anomalies detected in Kubernetes cluster',
          logPatterns: [
            'Pod restarted 5 times in the last hour',
            'OOMKilled: Container killed due to memory constraints'
          ]
        },
        enabled: true
      }
    ],
    metrics: [
      {
        id: 'metric-3',
        resource: 'DynamoDB: UserTable',
        resourceType: 'metrics',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        score: 0.82,
        status: 'Warning',
        details: {
          description: 'Unusual read capacity consumption pattern',
          affectedMetrics: [
            'ConsumedReadCapacityUnits'
          ]
        },
        enabled: true
      }
    ],
    traces: []
  },
  prod: {
    logs: [],
    metrics: [
      {
        id: 'metric-4',
        resource: 'CloudFront: MainDistribution',
        resourceType: 'metrics',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        score: 0.95,
        status: 'Critical',
        details: {
          description: 'Significant increase in 5xx error rates',
          affectedMetrics: [
            '5xxErrorRate',
            'TotalErrorRate'
          ]
        },
        enabled: true
      }
    ],
    traces: [
      {
        id: 'trace-2',
        resource: 'AppSync: GraphQLAPI',
        resourceType: 'traces',
        timestamp: new Date(Date.now() - 2700000).toISOString(),
        score: 0.88,
        status: 'Critical',
        details: {
          description: 'Unusual error pattern in GraphQL resolver',
          traceIds: [
            'trace-abcde-12345',
            'trace-fghij-67890'
          ]
        },
        enabled: true
      }
    ]
  }
};

// This would be replaced with actual SageMaker integration
async function detectAnomaliesWithSageMaker(
  environment: string,
  resourceType: 'logs' | 'metrics' | 'traces',
  resourceId?: string
): Promise<AnomalyResult[]> {
  // In a real implementation, this would call SageMaker endpoints
  // For now, we'll return mock data based on environment and resource type
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data
  const envData = mockAnomalies[environment] || {};
  const results = envData[resourceType] || [];
  
  // Filter by resourceId if provided
  return resourceId 
    ? results.filter(r => r.resource === resourceId)
    : results;
}

export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const environment = searchParams.get('environment') || 'dev';
  const resourceType = (searchParams.get('resourceType') || 'logs') as 'logs' | 'metrics' | 'traces';
  const resourceId = searchParams.get('resourceId') || undefined;
  
  try {
    // Get anomalies from SageMaker (mock for now)
    const anomalies = await detectAnomaliesWithSageMaker(
      environment,
      resourceType,
      resourceId || undefined
    );
    
    return NextResponse.json({ anomalies });
  } catch (error) {
    console.error('Error detecting anomalies:', error);
    return NextResponse.json(
      { error: 'Failed to detect anomalies' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as AnomalyDetectionRequest;
    
    // Validate request
    if (!body.environment || !body.resourceType) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Get anomalies from SageMaker (mock for now)
    const anomalies = await detectAnomaliesWithSageMaker(
      body.environment,
      body.resourceType,
      body.resourceId
    );
    
    return NextResponse.json({ anomalies });
  } catch (error) {
    console.error('Error detecting anomalies:', error);
    return NextResponse.json(
      { error: 'Failed to detect anomalies' },
      { status: 500 }
    );
  }
}

// Endpoint to toggle anomaly detection for a specific resource
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    if (!body.id || body.enabled === undefined) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // In a real implementation, this would update the configuration in a database
    // For now, we'll just return success
    
    return NextResponse.json({ 
      success: true,
      message: `Anomaly detection ${body.enabled ? 'enabled' : 'disabled'} for resource with ID ${body.id}`
    });
  } catch (error) {
    console.error('Error updating anomaly detection:', error);
    return NextResponse.json(
      { error: 'Failed to update anomaly detection' },
      { status: 500 }
    );
  }
}
