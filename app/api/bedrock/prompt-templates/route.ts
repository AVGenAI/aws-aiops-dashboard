import { NextRequest, NextResponse } from 'next/server';

// This would typically come from a database
// For this example, we'll use mock data
const templateData = {
  'dev': [
    {
      id: 'template-1',
      name: 'General Q&A',
      description: 'A general purpose template for question answering tasks.',
      template: 'Answer the following question accurately and concisely:\n\nQuestion: {{question}}\n\nAnswer:',
      variables: ['question'],
      modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
      createdAt: '2025-03-15T12:00:00Z',
      updatedAt: '2025-03-15T12:00:00Z',
      effectiveness: 4.5,
      usageCount: 120
    },
    {
      id: 'template-2',
      name: 'AWS Service Explanation',
      description: 'Explains AWS services in detail with examples.',
      template: 'Explain the AWS service {{service_name}} in detail. Include:\n\n1. What it is\n2. Key features and benefits\n3. Common use cases\n4. How it integrates with other AWS services\n5. Pricing model\n6. Best practices\n\nProvide concrete examples where appropriate.',
      variables: ['service_name'],
      modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
      createdAt: '2025-03-16T14:30:00Z',
      updatedAt: '2025-03-16T14:30:00Z',
      effectiveness: 4.8,
      usageCount: 85
    },
    {
      id: 'template-3',
      name: 'Log Analysis',
      description: 'Analyzes CloudWatch logs to identify issues and suggest solutions.',
      template: 'Analyze the following CloudWatch log entries and identify any errors, warnings, or potential issues. Suggest possible causes and solutions.\n\nLogs:\n{{log_entries}}\n\nAnalysis:',
      variables: ['log_entries'],
      modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
      createdAt: '2025-03-17T09:15:00Z',
      updatedAt: '2025-03-17T09:15:00Z',
      effectiveness: 4.2,
      usageCount: 67
    },
    {
      id: 'template-4',
      name: 'Infrastructure as Code Review',
      description: 'Reviews CloudFormation or Terraform code for best practices and security issues.',
      template: 'Review the following Infrastructure as Code ({{iac_type}}) and provide feedback on:\n\n1. Best practices compliance\n2. Security concerns\n3. Cost optimization opportunities\n4. Performance considerations\n5. Maintainability\n\nCode:\n{{iac_code}}\n\nReview:',
      variables: ['iac_type', 'iac_code'],
      modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
      createdAt: '2025-03-18T16:45:00Z',
      updatedAt: '2025-03-18T16:45:00Z',
      effectiveness: 4.7,
      usageCount: 42
    },
    {
      id: 'template-5',
      name: 'Anomaly Root Cause Analysis',
      description: 'Analyzes system metrics and logs to determine the root cause of anomalies.',
      template: 'Analyze the following system metrics and logs to determine the root cause of the observed anomaly.\n\nAnomaly Description: {{anomaly_description}}\n\nSystem Metrics:\n{{system_metrics}}\n\nLogs:\n{{logs}}\n\nRoot Cause Analysis:',
      variables: ['anomaly_description', 'system_metrics', 'logs'],
      modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
      createdAt: '2025-03-19T11:30:00Z',
      updatedAt: '2025-03-19T11:30:00Z',
      effectiveness: 4.6,
      usageCount: 38
    }
  ],
  'uat': [
    {
      id: 'template-1',
      name: 'General Q&A',
      description: 'A general purpose template for question answering tasks.',
      template: 'Answer the following question accurately and concisely:\n\nQuestion: {{question}}\n\nAnswer:',
      variables: ['question'],
      modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
      createdAt: '2025-03-15T12:00:00Z',
      updatedAt: '2025-03-15T12:00:00Z',
      effectiveness: 4.5,
      usageCount: 120
    },
    {
      id: 'template-3',
      name: 'Log Analysis',
      description: 'Analyzes CloudWatch logs to identify issues and suggest solutions.',
      template: 'Analyze the following CloudWatch log entries and identify any errors, warnings, or potential issues. Suggest possible causes and solutions.\n\nLogs:\n{{log_entries}}\n\nAnalysis:',
      variables: ['log_entries'],
      modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
      createdAt: '2025-03-17T09:15:00Z',
      updatedAt: '2025-03-17T09:15:00Z',
      effectiveness: 4.2,
      usageCount: 67
    }
  ],
  'prod': [
    {
      id: 'template-1',
      name: 'General Q&A',
      description: 'A general purpose template for question answering tasks.',
      template: 'Answer the following question accurately and concisely:\n\nQuestion: {{question}}\n\nAnswer:',
      variables: ['question'],
      modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
      createdAt: '2025-03-15T12:00:00Z',
      updatedAt: '2025-03-15T12:00:00Z',
      effectiveness: 4.5,
      usageCount: 120
    }
  ]
};

export async function GET(request: NextRequest) {
  try {
    // Get environment and modelId from query parameters
    const searchParams = request.nextUrl.searchParams;
    const environment = searchParams.get('environment') || 'dev';
    const modelId = searchParams.get('modelId');
    
    // Get template data for the specified environment
    let templates = templateData[environment as keyof typeof templateData] || templateData['dev'];
    
    // Filter by modelId if provided
    if (modelId) {
      templates = templates.filter(template => template.modelId === modelId);
    }
    
    // Return the template data
    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error fetching prompt templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prompt templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.template || !data.modelId || !data.variables) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // In a real application, this would save to a database
    // For this example, we'll just return success
    
    return NextResponse.json({
      success: true,
      template: {
        id: `template-${Date.now()}`,
        name: data.name,
        description: data.description || '',
        template: data.template,
        variables: data.variables,
        modelId: data.modelId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        effectiveness: 0,
        usageCount: 0
      }
    });
  } catch (error) {
    console.error('Error creating prompt template:', error);
    return NextResponse.json(
      { error: 'Failed to create prompt template' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.id) {
      return NextResponse.json(
        { error: 'Missing template ID' },
        { status: 400 }
      );
    }
    
    // In a real application, this would update in a database
    // For this example, we'll just return success
    
    return NextResponse.json({
      success: true,
      template: {
        ...data,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error updating prompt template:', error);
    return NextResponse.json(
      { error: 'Failed to update prompt template' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing template ID' },
        { status: 400 }
      );
    }
    
    // In a real application, this would delete from a database
    // For this example, we'll just return success
    
    return NextResponse.json({
      success: true,
      id
    });
  } catch (error) {
    console.error('Error deleting prompt template:', error);
    return NextResponse.json(
      { error: 'Failed to delete prompt template' },
      { status: 500 }
    );
  }
}
