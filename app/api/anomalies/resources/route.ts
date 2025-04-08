import { NextRequest, NextResponse } from 'next/server';

// Types for resource utilization data
interface ResourceData {
  id: string;
  name: string;
  type: string;
  x: number; // CPU utilization
  y: number; // Memory utilization
  z: number; // Anomaly score (0-1)
  status: 'Normal' | 'Warning' | 'Critical';
}

interface ResourceResponse {
  resources: ResourceData[];
  xMetric: string;
  yMetric: string;
}

// Generate mock resource data based on the environment
function generateMockResourceData(
  environment: string,
  xMetric: string = 'CPU Utilization',
  yMetric: string = 'Memory Utilization'
): ResourceData[] {
  // Define resource types and names based on common AWS services
  const resourceTypes = [
    { type: 'Compute', names: ['EC2 Instance', 'Lambda Function', 'ECS Task', 'EKS Pod', 'Fargate Container'] },
    { type: 'Database', names: ['RDS Instance', 'DynamoDB Table', 'ElastiCache Cluster', 'DocumentDB Cluster', 'Neptune Instance'] },
    { type: 'Storage', names: ['S3 Bucket', 'EFS FileSystem', 'EBS Volume', 'FSx FileSystem', 'Storage Gateway'] },
    { type: 'Networking', names: ['API Gateway', 'Load Balancer', 'VPC Endpoint', 'Transit Gateway', 'CloudFront Distribution'] },
    { type: 'Analytics', names: ['EMR Cluster', 'Kinesis Stream', 'Redshift Cluster', 'Athena Query', 'Glue Job'] },
    { type: 'Container', names: ['ECS Cluster', 'EKS Cluster', 'ECR Repository', 'App Runner Service', 'Batch Job'] },
    { type: 'Serverless', names: ['Lambda Function', 'Step Functions', 'EventBridge Rule', 'SQS Queue', 'SNS Topic'] },
  ];
  
  // Number of resources to generate based on environment
  const resourceCount = environment === 'prod' ? 15 : environment === 'uat' ? 10 : 8;
  
  const resources: ResourceData[] = [];
  
  // Generate random resources
  for (let i = 0; i < resourceCount; i++) {
    // Select a random resource type
    const typeIndex = Math.floor(Math.random() * resourceTypes.length);
    const resourceType = resourceTypes[typeIndex];
    
    // Select a random name from the resource type
    const nameIndex = Math.floor(Math.random() * resourceType.names.length);
    const name = resourceType.names[nameIndex];
    
    // Generate utilization values based on environment
    let x: number, y: number, z: number;
    let status: 'Normal' | 'Warning' | 'Critical';
    
    if (environment === 'prod') {
      // Production environment - generally more stable, but with a few critical issues
      if (Math.random() < 0.15) {
        // Critical resource
        x = 80 + Math.random() * 20;
        y = 70 + Math.random() * 30;
        z = 0.8 + Math.random() * 0.2;
        status = 'Critical';
      } else if (Math.random() < 0.3) {
        // Warning resource
        x = 60 + Math.random() * 20;
        y = 50 + Math.random() * 30;
        z = 0.5 + Math.random() * 0.3;
        status = 'Warning';
      } else {
        // Normal resource
        x = 10 + Math.random() * 50;
        y = 10 + Math.random() * 40;
        z = 0.1 + Math.random() * 0.3;
        status = 'Normal';
      }
    } else if (environment === 'uat') {
      // UAT environment - more warnings, fewer criticals
      if (Math.random() < 0.1) {
        // Critical resource
        x = 80 + Math.random() * 20;
        y = 70 + Math.random() * 30;
        z = 0.8 + Math.random() * 0.2;
        status = 'Critical';
      } else if (Math.random() < 0.4) {
        // Warning resource
        x = 60 + Math.random() * 20;
        y = 50 + Math.random() * 30;
        z = 0.5 + Math.random() * 0.3;
        status = 'Warning';
      } else {
        // Normal resource
        x = 10 + Math.random() * 50;
        y = 10 + Math.random() * 40;
        z = 0.1 + Math.random() * 0.3;
        status = 'Normal';
      }
    } else {
      // Dev environment - more volatile, more issues
      if (Math.random() < 0.2) {
        // Critical resource
        x = 80 + Math.random() * 20;
        y = 70 + Math.random() * 30;
        z = 0.8 + Math.random() * 0.2;
        status = 'Critical';
      } else if (Math.random() < 0.5) {
        // Warning resource
        x = 60 + Math.random() * 20;
        y = 50 + Math.random() * 30;
        z = 0.5 + Math.random() * 0.3;
        status = 'Warning';
      } else {
        // Normal resource
        x = 10 + Math.random() * 50;
        y = 10 + Math.random() * 40;
        z = 0.1 + Math.random() * 0.3;
        status = 'Normal';
      }
    }
    
    // Round values to 1 decimal place
    x = Math.round(x * 10) / 10;
    y = Math.round(y * 10) / 10;
    z = Math.round(z * 100) / 100;
    
    resources.push({
      id: `resource-${i + 1}`,
      name: `${name} ${i + 1}`,
      type: resourceType.type,
      x,
      y,
      z,
      status
    });
  }
  
  return resources;
}

export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const environment = searchParams.get('environment') || 'dev';
  const xMetric = searchParams.get('xMetric') || 'CPU Utilization';
  const yMetric = searchParams.get('yMetric') || 'Memory Utilization';
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate mock data
    const resources = generateMockResourceData(environment, xMetric, yMetric);
    
    return NextResponse.json({ 
      resources,
      xMetric,
      yMetric
    } as ResourceResponse);
  } catch (error) {
    console.error('Error generating resource data:', error);
    return NextResponse.json(
      { error: 'Failed to generate resource data' },
      { status: 500 }
    );
  }
}
