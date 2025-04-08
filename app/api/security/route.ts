import { NextResponse } from 'next/server';
import {
  SecurityHubClient,
  GetFindingsCommand,
  SeverityLabel,
} from "@aws-sdk/client-securityhub";

const config = { region: process.env.AWS_REGION || "us-east-1" };
const securityClient = new SecurityHubClient(config);

export async function GET() {
  try {
    // Get findings from Security Hub
    const command = new GetFindingsCommand({
      MaxResults: 100, // Limit to 100 findings
      Filters: {
        // Filter for active findings (not archived)
        RecordState: [{ Value: 'ACTIVE', Comparison: 'EQUALS' }],
        // Filter for findings with severity (optional)
        // SeverityLabel: [{ Value: 'HIGH', Comparison: 'EQUALS' }],
      },
      SortCriteria: [{ Field: 'SeverityLabel', SortOrder: 'desc' }],
    });

    const response = await securityClient.send(command);

    // Count findings by severity
    const severityCounts = {
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
      INFORMATIONAL: 0,
    };

    // Process findings
    const findings = response.Findings?.map(finding => {
      // Count by severity
      const severity = finding.Severity?.Label || 'INFORMATIONAL';
      if (severity in severityCounts) {
        severityCounts[severity as keyof typeof severityCounts]++;
      }

      return {
        id: finding.Id || '',
        title: finding.Title || 'Untitled Finding',
        description: finding.Description || '',
        severity: severity,
        resourceType: finding.Resources?.[0]?.Type || 'Unknown',
        resourceId: finding.Resources?.[0]?.Id || '',
        createdAt: finding.CreatedAt || '',
        updatedAt: finding.UpdatedAt || '',
      };
    }) || [];

    return NextResponse.json({
      findings: findings.slice(0, 10), // Return only top 10 findings
      counts: severityCounts,
      total: findings.length,
    });
  } catch (error: any) {
    console.error("Error fetching security findings:", error);
    
    // Return mock data for development if Security Hub API is not available
    return NextResponse.json({
      error: error.message || 'Failed to fetch security findings',
      findings: [
        {
          id: 'mock-finding-1',
          title: 'S3 Bucket without encryption',
          description: 'The S3 bucket does not have default encryption enabled',
          severity: 'HIGH',
          resourceType: 'AwsS3Bucket',
          resourceId: 'example-bucket',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'mock-finding-2',
          title: 'Security group allows unrestricted access',
          description: 'The security group allows unrestricted access from the internet',
          severity: 'MEDIUM',
          resourceType: 'AwsEc2SecurityGroup',
          resourceId: 'sg-12345',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      counts: {
        CRITICAL: 0,
        HIGH: 1,
        MEDIUM: 1,
        LOW: 0,
        INFORMATIONAL: 0,
      },
      total: 2,
    }, { status: 200 });
  }
}
