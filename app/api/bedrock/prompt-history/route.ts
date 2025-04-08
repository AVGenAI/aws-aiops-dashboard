import { NextRequest, NextResponse } from 'next/server';

// This would typically come from a database
// For this example, we'll use mock data
const historyData = {
  'dev': {
    'anthropic.claude-3-sonnet-20240229-v1:0': [
      {
        prompt: 'Explain the AWS Lambda service in detail. Include:\n\n1. What it is\n2. Key features and benefits\n3. Common use cases\n4. How it integrates with other AWS services\n5. Pricing model\n6. Best practices\n\nProvide concrete examples where appropriate.',
        variables: {
          'service_name': 'Lambda'
        },
        timestamp: '2025-04-07T14:30:00Z'
      },
      {
        prompt: 'Analyze the following CloudWatch log entries and identify any errors, warnings, or potential issues. Suggest possible causes and solutions.\n\nLogs:\n2025-04-07T10:15:32Z ERROR [app.module] Failed to connect to database after 5 retries\n2025-04-07T10:15:35Z WARN [app.service] Service degraded, operating in fallback mode\n2025-04-07T10:16:02Z ERROR [app.module] Database connection timeout\n2025-04-07T10:20:15Z INFO [app.module] Database connection established\n\nAnalysis:',
        variables: {
          'log_entries': '2025-04-07T10:15:32Z ERROR [app.module] Failed to connect to database after 5 retries\n2025-04-07T10:15:35Z WARN [app.service] Service degraded, operating in fallback mode\n2025-04-07T10:16:02Z ERROR [app.module] Database connection timeout\n2025-04-07T10:20:15Z INFO [app.module] Database connection established'
        },
        timestamp: '2025-04-07T15:45:00Z'
      },
      {
        prompt: 'What are the best practices for securing AWS S3 buckets?',
        variables: {
          'question': 'What are the best practices for securing AWS S3 buckets?'
        },
        timestamp: '2025-04-07T16:20:00Z'
      },
      {
        prompt: 'Analyze the following system metrics and logs to determine the root cause of the observed anomaly.\n\nAnomaly Description: High CPU usage on EC2 instance i-1234abcd\n\nSystem Metrics:\nCPU: 95% sustained for 30 minutes\nMemory: 45% utilization\nDisk I/O: Normal\nNetwork: 2x normal traffic\n\nLogs:\n2025-04-07T12:30:15Z INFO [app.worker] Starting batch processing job\n2025-04-07T12:30:20Z INFO [app.worker] Processing 10000 records\n2025-04-07T12:35:10Z WARN [app.worker] Processing taking longer than expected\n2025-04-07T12:40:05Z ERROR [app.worker] Failed to complete batch job, retrying\n2025-04-07T12:45:30Z ERROR [app.worker] Out of memory error\n\nRoot Cause Analysis:',
        variables: {
          'anomaly_description': 'High CPU usage on EC2 instance i-1234abcd',
          'system_metrics': 'CPU: 95% sustained for 30 minutes\nMemory: 45% utilization\nDisk I/O: Normal\nNetwork: 2x normal traffic',
          'logs': '2025-04-07T12:30:15Z INFO [app.worker] Starting batch processing job\n2025-04-07T12:30:20Z INFO [app.worker] Processing 10000 records\n2025-04-07T12:35:10Z WARN [app.worker] Processing taking longer than expected\n2025-04-07T12:40:05Z ERROR [app.worker] Failed to complete batch job, retrying\n2025-04-07T12:45:30Z ERROR [app.worker] Out of memory error'
        },
        timestamp: '2025-04-07T17:10:00Z'
      },
      {
        prompt: 'Review the following Infrastructure as Code (CloudFormation) and provide feedback on:\n\n1. Best practices compliance\n2. Security concerns\n3. Cost optimization opportunities\n4. Performance considerations\n5. Maintainability\n\nCode:\nResources:\n  MyEC2Instance:\n    Type: AWS::EC2::Instance\n    Properties:\n      InstanceType: t2.micro\n      ImageId: ami-0c55b159cbfafe1f0\n      SecurityGroups:\n        - !Ref MySecurityGroup\n  \n  MySecurityGroup:\n    Type: AWS::EC2::SecurityGroup\n    Properties:\n      GroupDescription: Allow SSH and HTTP\n      SecurityGroupIngress:\n        - IpProtocol: tcp\n          FromPort: 22\n          ToPort: 22\n          CidrIp: 0.0.0.0/0\n        - IpProtocol: tcp\n          FromPort: 80\n          ToPort: 80\n          CidrIp: 0.0.0.0/0\n\nReview:',
        variables: {
          'iac_type': 'CloudFormation',
          'iac_code': 'Resources:\n  MyEC2Instance:\n    Type: AWS::EC2::Instance\n    Properties:\n      InstanceType: t2.micro\n      ImageId: ami-0c55b159cbfafe1f0\n      SecurityGroups:\n        - !Ref MySecurityGroup\n  \n  MySecurityGroup:\n    Type: AWS::EC2::SecurityGroup\n    Properties:\n      GroupDescription: Allow SSH and HTTP\n      SecurityGroupIngress:\n        - IpProtocol: tcp\n          FromPort: 22\n          ToPort: 22\n          CidrIp: 0.0.0.0/0\n        - IpProtocol: tcp\n          FromPort: 80\n          ToPort: 80\n          CidrIp: 0.0.0.0/0'
        },
        timestamp: '2025-04-07T18:05:00Z'
      }
    ],
    'meta.llama3-70b-instruct-v1:0': [
      {
        prompt: 'What are the key differences between Amazon S3 and Amazon EBS?',
        variables: {
          'question': 'What are the key differences between Amazon S3 and Amazon EBS?'
        },
        timestamp: '2025-04-07T13:15:00Z'
      },
      {
        prompt: 'Explain the concept of AWS IAM roles and how they differ from IAM users.',
        variables: {
          'question': 'Explain the concept of AWS IAM roles and how they differ from IAM users.'
        },
        timestamp: '2025-04-07T14:00:00Z'
      }
    ]
  },
  'uat': {
    'anthropic.claude-3-sonnet-20240229-v1:0': [
      {
        prompt: 'What are the best practices for securing AWS S3 buckets?',
        variables: {
          'question': 'What are the best practices for securing AWS S3 buckets?'
        },
        timestamp: '2025-04-07T16:20:00Z'
      }
    ]
  },
  'prod': {
    'anthropic.claude-3-sonnet-20240229-v1:0': []
  }
};

export async function GET(request: NextRequest) {
  try {
    // Get environment and modelId from query parameters
    const searchParams = request.nextUrl.searchParams;
    const environment = searchParams.get('environment') || 'dev';
    const modelId = searchParams.get('modelId');
    
    // Get history data for the specified environment
    const envHistory = historyData[environment as keyof typeof historyData] || {};
    
    // Filter by modelId if provided
    let history: any[] = [];
    if (modelId && envHistory[modelId as keyof typeof envHistory]) {
      history = envHistory[modelId as keyof typeof envHistory];
    } else if (!modelId) {
      // If no modelId provided, return all history for the environment
      history = Object.values(envHistory).flat();
    }
    
    // Return the history data
    return NextResponse.json({ history });
  } catch (error) {
    console.error('Error fetching prompt history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prompt history' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.prompt || !data.modelId || !data.environment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // In a real application, this would save to a database
    // For this example, we'll just return success
    
    return NextResponse.json({
      success: true,
      history: {
        prompt: data.prompt,
        variables: data.variables || {},
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error saving prompt history:', error);
    return NextResponse.json(
      { error: 'Failed to save prompt history' },
      { status: 500 }
    );
  }
}
