import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';
// TODO: Refactor callBedrockAPI and getAWSCredentials into shared utilities
// For now, we might duplicate or simplify them here

// --- Simplified/Placeholder AWS Credential Logic ---
const getAWSCredentials = (environment: string) => {
  // Placeholder - use default env vars or mock
  return {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || 'us-east-1'
  };
};

// --- Simplified/Placeholder Bedrock Call Logic ---
async function callBedrockForRCA(prompt: string, environment: string): Promise<any> {
  const credentials = getAWSCredentials(environment);
  if (!credentials.accessKeyId || !credentials.secretAccessKey) {
    console.log('RCA: AWS credentials not available, returning mock analysis');
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      rootCause: "Mock Analysis: The anomaly is likely due to a simulated resource constraint.",
      evidence: ["Metric value exceeded threshold.", "Simulated high traffic pattern detected."],
      suggestions: ["Monitor related metrics.", "Consider adjusting simulated thresholds."]
    };
  }

  AWS.config.update({
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
    region: credentials.region
  });

  const bedrockRuntime = new AWS.BedrockRuntime({ apiVersion: '2023-09-30' });
  const modelId = 'anthropic.claude-3-sonnet-20240229-v1:0'; // Or make configurable

  const requestBody = {
    prompt: `Human: ${prompt}\n\nAssistant:`,
    max_tokens_to_sample: 1000, // Adjust as needed
    temperature: 0.5,
    top_p: 0.9,
    stop_sequences: ['\n\nHuman:']
  };

  const params = {
    modelId: modelId,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(requestBody)
  };

  try {
    const response = await bedrockRuntime.invokeModel(params).promise();
    const responseBody = JSON.parse(response.body.toString());
    const completion = responseBody.completion || '';

    // Basic parsing (assuming Bedrock returns structured text)
    // This needs significant refinement based on actual Bedrock output format
    const rootCauseMatch = completion.match(/Root Cause: (.*?)\n/);
    const evidenceMatch = completion.match(/Evidence: (.*?)\n/); // Needs better parsing for lists
    const suggestionsMatch = completion.match(/Suggestions: (.*?)\n/); // Needs better parsing for lists

    return {
      rootCause: rootCauseMatch ? rootCauseMatch[1] : "Could not determine root cause from analysis.",
      evidence: evidenceMatch ? evidenceMatch[1].split(', ') : ["Analysis did not provide specific evidence."],
      suggestions: suggestionsMatch ? suggestionsMatch[1].split(', ') : ["Review system logs and metrics manually."]
    };
  } catch (error) {
    console.error('Error calling Bedrock for RCA:', error);
    throw new Error('Failed to get analysis from Bedrock');
  }
}

// --- Simplified/Placeholder CloudWatch Metrics Fetch Logic ---
async function getRelatedMetrics(
  environment: string, 
  resourceId: string | undefined, 
  namespace: string | undefined, // Determine namespace based on metric/resource
  anomalyTimestamp: string,
  anomalyMetric: string
): Promise<string> {
    if (!resourceId || !namespace) return "No related metrics available (missing resourceId or namespace).";

    const credentials = getAWSCredentials(environment);
    if (!credentials.accessKeyId || !credentials.secretAccessKey) {
        return "Skipping related metrics fetch (AWS credentials not available).";
    }
    
    AWS.config.update({
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
        region: credentials.region
    });

    const cloudWatch = new AWS.CloudWatch({ apiVersion: '2010-08-01' });
    
    // Define related metrics based on the anomaly metric/namespace
    let relatedMetricNames: string[] = [];
    let dimensionName = 'ResourceId'; // Default
    if (namespace === 'AWS/EC2') {
        relatedMetricNames = ['CPUUtilization', 'MemoryUtilization', 'DiskReadBytes', 'DiskWriteBytes', 'NetworkIn', 'NetworkOut'].filter(m => m !== anomalyMetric);
        dimensionName = 'InstanceId';
    } else if (namespace === 'AWS/RDS') {
        relatedMetricNames = ['CPUUtilization', 'DatabaseConnections', 'FreeStorageSpace', 'ReadIOPS', 'WriteIOPS'].filter(m => m !== anomalyMetric);
        dimensionName = 'DBInstanceIdentifier';
    } // Add more namespaces as needed

    if (relatedMetricNames.length === 0) return "No relevant related metrics defined for this namespace.";

    const anomalyTime = new Date(anomalyTimestamp);
    const startTime = new Date(anomalyTime.getTime() - 15 * 60 * 1000); // 15 mins before
    const endTime = new Date(anomalyTime.getTime() + 15 * 60 * 1000); // 15 mins after

    let summary = "Related Metrics Summary:\n";

    try {
        for (const metricName of relatedMetricNames) {
            const params = {
                Namespace: namespace,
                MetricName: metricName,
                Dimensions: [{ Name: dimensionName, Value: resourceId }],
                StartTime: startTime,
                EndTime: endTime,
                Period: 60, // 1 minute
                Statistics: ['Average'],
            };
            const result = await cloudWatch.getMetricStatistics(params).promise();
            const datapoints = result.Datapoints?.sort((a, b) => (a.Timestamp?.getTime() || 0) - (b.Timestamp?.getTime() || 0));
            
            if (datapoints && datapoints.length > 0) {
                const avgValue = datapoints.reduce((sum, dp) => sum + (dp.Average || 0), 0) / datapoints.length;
                summary += `- ${metricName}: Avg ~${avgValue.toFixed(2)} (${result.Datapoints?.[0]?.Unit || 'N/A'}) around the anomaly time.\n`;
            } else {
                 summary += `- ${metricName}: No data found around the anomaly time.\n`;
            }
        }
        return summary;
    } catch (error) {
        console.error('Error fetching related metrics:', error);
        return "Could not fetch related metrics due to an error.\n";
    }
}

// --- Main POST Handler ---
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { timestamp, value, metric, status, resourceId, environment = 'dev' } = body;

    if (!timestamp || value === undefined || !metric || !status) {
      return NextResponse.json({ error: 'Missing required anomaly details' }, { status: 400 });
    }

    console.log('RCA Request Received:', body);

    // 1. Determine Namespace (simplified logic)
    let namespace = 'AWS/EC2'; // Default or determine from metric/resource context
    if (metric.includes('DB') || metric.includes('IOPS')) namespace = 'AWS/RDS';
    // Add more sophisticated namespace detection if needed

    // 2. Gather Context (start with related metrics)
    const relatedMetricsSummary = await getRelatedMetrics(environment, resourceId, namespace, timestamp, metric);
    // TODO: Add calls to gather logs, events, config changes

    // 3. Construct Prompt for Bedrock
    const prompt = `
Analyze the root cause for the following anomaly detected in our AWS environment:
- Metric: ${metric}
- Resource ID: ${resourceId || 'N/A'}
- Timestamp: ${new Date(timestamp).toISOString()}
- Value: ${value.toFixed(2)}
- Status: ${status}

Provide a potential root cause, supporting evidence, and suggested remediation steps.

Available Context:
${relatedMetricsSummary}
(Context from logs, events, and config changes would be added here in future implementations)

Structure your response clearly with sections for "Root Cause:", "Evidence:", and "Suggestions:". Be concise and focus on the most likely explanations based *only* on the provided information.
`;

    console.log("Constructed Bedrock Prompt:", prompt);

    // 4. Call Bedrock for Analysis
    const analysis = await callBedrockForRCA(prompt, environment);

    // 5. Return Analysis
    return NextResponse.json({ analysis });

  } catch (error: any) {
    console.error('Error in RCA API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to perform Root Cause Analysis' },
      { status: 500 }
    );
  }
}
