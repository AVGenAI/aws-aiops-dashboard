import { NextRequest, NextResponse } from 'next/server';

interface Recommendation {
  id: string;
  category: 'cost' | 'performance' | 'security' | 'fault-tolerance' | 'service-limits';
  title: string;
  description: string;
  status: 'ok' | 'warning' | 'error' | 'not-available';
  resourcesAffected: number;
  estimatedMonthlySavings?: number;
}

// Mock data for different environments
const environmentData: Record<string, {
  recommendations: Recommendation[];
  summary: {
    costSavings: number;
    securityIssues: number;
    faultToleranceWarnings: number;
    serviceLimitsWarnings: number;
  }
}> = {
  dev: {
    recommendations: [
      {
        id: 'low-utilization-ec2',
        category: 'cost',
        title: 'Low Utilization Amazon EC2 Instances',
        description: 'You have instances that were running at low utilization over the last 14 days. Consider stopping or terminating them.',
        status: 'warning',
        resourcesAffected: 3,
        estimatedMonthlySavings: 45.20
      },
      {
        id: 'idle-load-balancers',
        category: 'cost',
        title: 'Idle Load Balancers',
        description: 'You have load balancers with no healthy instances registered or that had very low traffic in the last 30 days.',
        status: 'warning',
        resourcesAffected: 1,
        estimatedMonthlySavings: 18.00
      },
      {
        id: 'security-groups',
        category: 'security',
        title: 'Security Groups - Unrestricted Access',
        description: 'You have security groups with unrestricted access (0.0.0.0/0) to specific ports.',
        status: 'error',
        resourcesAffected: 2
      },
      {
        id: 'iam-password-policy',
        category: 'security',
        title: 'IAM Password Policy',
        description: 'Your IAM password policy does not require a minimum length of at least 8 characters.',
        status: 'warning',
        resourcesAffected: 1
      },
      {
        id: 'ebs-snapshots',
        category: 'fault-tolerance',
        title: 'Amazon EBS Snapshots',
        description: 'You have EBS volumes that do not have recent snapshots.',
        status: 'warning',
        resourcesAffected: 4
      },
      {
        id: 'service-limits',
        category: 'service-limits',
        title: 'Service Limits',
        description: 'You are approaching the limit for one or more AWS services.',
        status: 'warning',
        resourcesAffected: 2
      },
      {
        id: 'rds-multi-az',
        category: 'fault-tolerance',
        title: 'Amazon RDS Multi-AZ',
        description: 'You have RDS instances that are not configured for Multi-AZ deployment.',
        status: 'warning',
        resourcesAffected: 1
      },
      {
        id: 'cloudfront-optimization',
        category: 'performance',
        title: 'CloudFront Content Delivery Optimization',
        description: 'Your CloudFront distributions could be optimized for better performance.',
        status: 'warning',
        resourcesAffected: 1
      }
    ],
    summary: {
      costSavings: 63.20,
      securityIssues: 2,
      faultToleranceWarnings: 5,
      serviceLimitsWarnings: 2
    }
  },
  uat: {
    recommendations: [
      {
        id: 'low-utilization-ec2',
        category: 'cost',
        title: 'Low Utilization Amazon EC2 Instances',
        description: 'You have instances that were running at low utilization over the last 14 days. Consider stopping or terminating them.',
        status: 'warning',
        resourcesAffected: 2,
        estimatedMonthlySavings: 32.50
      },
      {
        id: 'security-groups',
        category: 'security',
        title: 'Security Groups - Unrestricted Access',
        description: 'You have security groups with unrestricted access (0.0.0.0/0) to specific ports.',
        status: 'error',
        resourcesAffected: 1
      },
      {
        id: 'ebs-snapshots',
        category: 'fault-tolerance',
        title: 'Amazon EBS Snapshots',
        description: 'You have EBS volumes that do not have recent snapshots.',
        status: 'warning',
        resourcesAffected: 2
      },
      {
        id: 'service-limits',
        category: 'service-limits',
        title: 'Service Limits',
        description: 'You are approaching the limit for one or more AWS services.',
        status: 'warning',
        resourcesAffected: 1
      }
    ],
    summary: {
      costSavings: 32.50,
      securityIssues: 1,
      faultToleranceWarnings: 2,
      serviceLimitsWarnings: 1
    }
  },
  prod: {
    recommendations: [
      {
        id: 'security-groups',
        category: 'security',
        title: 'Security Groups - Unrestricted Access',
        description: 'You have security groups with unrestricted access (0.0.0.0/0) to specific ports.',
        status: 'error',
        resourcesAffected: 1
      },
      {
        id: 'ebs-snapshots',
        category: 'fault-tolerance',
        title: 'Amazon EBS Snapshots',
        description: 'You have EBS volumes that do not have recent snapshots.',
        status: 'warning',
        resourcesAffected: 1
      }
    ],
    summary: {
      costSavings: 0,
      securityIssues: 1,
      faultToleranceWarnings: 1,
      serviceLimitsWarnings: 0
    }
  }
};

export async function GET(request: NextRequest) {
  // Get environment from query parameter
  const searchParams = request.nextUrl.searchParams;
  const environment = searchParams.get('environment') || 'dev';
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return data for the specified environment
  const data = environmentData[environment] || environmentData.dev;
  
  return NextResponse.json(data);
}
