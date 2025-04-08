import { NextRequest, NextResponse } from 'next/server';

// This would typically use the AWS SDK to fetch real CloudWatch metrics
// For this example, we'll use mock data

// Mock data for different namespaces
const mockMetricsData = {
  'AWS/EC2': {
    'CPUUtilization': generateMetricData('CPUUtilization', 'AWS/EC2', 'Percent', 0, 100),
    'NetworkIn': generateMetricData('NetworkIn', 'AWS/EC2', 'Bytes', 0, 10485760),
    'NetworkOut': generateMetricData('NetworkOut', 'AWS/EC2', 'Bytes', 0, 5242880),
    'DiskReadBytes': generateMetricData('DiskReadBytes', 'AWS/EC2', 'Bytes', 0, 1048576),
    'DiskWriteBytes': generateMetricData('DiskWriteBytes', 'AWS/EC2', 'Bytes', 0, 2097152)
  },
  'AWS/RDS': {
    'CPUUtilization': generateMetricData('CPUUtilization', 'AWS/RDS', 'Percent', 0, 100),
    'DatabaseConnections': generateMetricData('DatabaseConnections', 'AWS/RDS', 'Count', 0, 100),
    'FreeStorageSpace': generateMetricData('FreeStorageSpace', 'AWS/RDS', 'Bytes', 1073741824, 10737418240),
    'ReadIOPS': generateMetricData('ReadIOPS', 'AWS/RDS', 'Count/Second', 0, 1000),
    'WriteIOPS': generateMetricData('WriteIOPS', 'AWS/RDS', 'Count/Second', 0, 800)
  },
  'AWS/Lambda': {
    'Invocations': generateMetricData('Invocations', 'AWS/Lambda', 'Count', 0, 1000),
    'Errors': generateMetricData('Errors', 'AWS/Lambda', 'Count', 0, 50),
    'Duration': generateMetricData('Duration', 'AWS/Lambda', 'Milliseconds', 0, 1000),
    'Throttles': generateMetricData('Throttles', 'AWS/Lambda', 'Count', 0, 10),
    'ConcurrentExecutions': generateMetricData('ConcurrentExecutions', 'AWS/Lambda', 'Count', 0, 100)
  }
};

// Helper function to generate random metric data
function generateMetricData(name: string, namespace: string, unit: string, min: number, max: number) {
  const now = new Date();
  const values = [];
  
  // Generate data points for the last 24 hours
  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
    values.push({
      timestamp: timestamp.toISOString(),
      value: min + Math.random() * (max - min)
    });
  }
  
  return {
    id: `${namespace}-${name}`,
    name,
    namespace,
    dimensions: [
      {
        name: 'InstanceId',
        value: 'i-1234567890abcdef0'
      }
    ],
    statistics: ['Average', 'Minimum', 'Maximum', 'Sum'],
    unit,
    period: 3600,
    values
  };
}

// Define the metric type
interface MetricData {
  id: string;
  name: string;
  namespace: string;
  dimensions: {
    name: string;
    value: string;
  }[];
  statistics: string[];
  unit: string;
  period: number;
  values: {
    timestamp: string;
    value: number;
  }[];
}

// Filter metrics based on time range
function filterMetricsByTimeRange(metrics: (MetricData | null)[], timeRange: string): MetricData[] {
  const now = new Date();
  let startTime: Date;
  
  switch (timeRange) {
    case '1h':
      startTime = new Date(now.getTime() - 60 * 60 * 1000);
      break;
    case '6h':
      startTime = new Date(now.getTime() - 6 * 60 * 60 * 1000);
      break;
    case '1d':
      startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case '1w':
      startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '1m':
      startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  }
  
  const result: MetricData[] = [];
  
  for (const metric of metrics) {
    if (metric === null) continue;
    
    const filteredValues = metric.values.filter(v => new Date(v.timestamp) >= startTime);
    
    result.push({
      id: metric.id,
      name: metric.name,
      namespace: metric.namespace,
      dimensions: metric.dimensions,
      statistics: metric.statistics,
      unit: metric.unit,
      period: metric.period,
      values: filteredValues
    });
  }
  
  return result;
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const environment = searchParams.get('environment') || 'dev';
    const namespace = searchParams.get('namespace') || 'AWS/EC2';
    const timeRange = searchParams.get('timeRange') || '1d';
    const resourceId = searchParams.get('resourceId');
    const metricsParam = searchParams.get('metrics');
    
    // Parse metrics parameter
    const metricNames = metricsParam ? metricsParam.split(',') : ['CPUUtilization'];
    
    // Get metrics data for the specified namespace
    const namespaceData = mockMetricsData[namespace as keyof typeof mockMetricsData] || {};
    
    // Filter metrics by name
    const metrics = metricNames
      .filter(name => namespaceData[name as keyof typeof namespaceData])
      .map(name => {
        const metric = namespaceData[name as keyof typeof namespaceData] as MetricData;
        
        if (!metric) return null;
        
        // If resourceId is provided, update the dimensions
        if (resourceId) {
          return {
            id: metric.id,
            name: metric.name,
            namespace: metric.namespace,
            dimensions: [
              {
                name: namespace.includes('EC2') ? 'InstanceId' : 
                      namespace.includes('RDS') ? 'DBInstanceIdentifier' : 
                      namespace.includes('Lambda') ? 'FunctionName' : 'ResourceId',
                value: resourceId
              }
            ],
            statistics: metric.statistics,
            unit: metric.unit,
            period: metric.period,
            values: metric.values
          };
        }
        
        return metric;
      });
    
    // Filter metrics by time range
    const filteredMetrics = filterMetricsByTimeRange(metrics, timeRange);
    
    // Return the metrics data
    return NextResponse.json({ metrics: filteredMetrics });
  } catch (error) {
    console.error('Error fetching CloudWatch metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CloudWatch metrics' },
      { status: 500 }
    );
  }
}
