import { NextRequest, NextResponse } from 'next/server';

// Types for anomaly correlation data
interface CorrelationData {
  name: string;
  count: number;
  critical: number;
  warning: number;
  normal: number;
  relatedTo?: string[];
}

interface CorrelationResponse {
  correlations: CorrelationData[];
}

// Generate mock correlation data based on the environment
function generateMockCorrelationData(environment: string): CorrelationData[] {
  // Define common anomaly types
  const anomalyTypes = [
    'High CPU Usage',
    'Memory Pressure',
    'Disk I/O',
    'Network Traffic',
    'API Latency',
    'Database Connections',
    'Error Rate',
    'Request Throttling',
    'Cache Miss Rate',
    'Queue Depth',
    'Connection Timeouts',
    'DNS Resolution',
    'SSL Certificate Issues',
    'Load Balancer Health',
    'Auto Scaling Events'
  ];
  
  // Number of anomaly types to include based on environment
  const typeCount = environment === 'prod' ? 10 : environment === 'uat' ? 8 : 6;
  
  // Select a subset of anomaly types
  const selectedTypes = anomalyTypes.slice(0, typeCount);
  
  // Generate correlation data for each selected type
  const correlations: CorrelationData[] = selectedTypes.map((name, index) => {
    // Generate counts based on environment and anomaly type
    let count: number, critical: number, warning: number, normal: number;
    
    if (environment === 'prod') {
      // Production environment - generally fewer issues, but more severe when they occur
      count = 5 + Math.floor(Math.random() * 10);
      critical = Math.floor(Math.random() * 0.3 * count);
      warning = Math.floor(Math.random() * 0.4 * count);
      normal = count - critical - warning;
    } else if (environment === 'uat') {
      // UAT environment - moderate number of issues
      count = 8 + Math.floor(Math.random() * 12);
      critical = Math.floor(Math.random() * 0.25 * count);
      warning = Math.floor(Math.random() * 0.5 * count);
      normal = count - critical - warning;
    } else {
      // Dev environment - more issues, but less critical
      count = 10 + Math.floor(Math.random() * 15);
      critical = Math.floor(Math.random() * 0.2 * count);
      warning = Math.floor(Math.random() * 0.5 * count);
      normal = count - critical - warning;
    }
    
    // Ensure counts are valid
    if (normal < 0) normal = 0;
    
    // Generate related anomaly types (2-4 related types)
    const relatedCount = 2 + Math.floor(Math.random() * 3);
    const relatedIndices = new Set<number>();
    
    // Add random related indices, excluding the current index
    while (relatedIndices.size < relatedCount && relatedIndices.size < selectedTypes.length - 1) {
      const relatedIndex = Math.floor(Math.random() * selectedTypes.length);
      if (relatedIndex !== index) {
        relatedIndices.add(relatedIndex);
      }
    }
    
    // Convert indices to anomaly type names
    const relatedTo = Array.from(relatedIndices).map(i => selectedTypes[i]);
    
    return {
      name,
      count,
      critical,
      warning,
      normal,
      relatedTo
    };
  });
  
  // Sort by count in descending order
  return correlations.sort((a, b) => b.count - a.count);
}

export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const environment = searchParams.get('environment') || 'dev';
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate mock data
    const correlations = generateMockCorrelationData(environment);
    
    return NextResponse.json({ 
      correlations
    } as CorrelationResponse);
  } catch (error) {
    console.error('Error generating correlation data:', error);
    return NextResponse.json(
      { error: 'Failed to generate correlation data' },
      { status: 500 }
    );
  }
}
