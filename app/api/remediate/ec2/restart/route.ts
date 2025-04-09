import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';

// TODO: Refactor getAWSCredentials into a shared utility
const getAWSCredentials = (environment: string) => {
  const accessKeyId = process.env[`AWS_ACCESS_KEY_ID_${environment.toUpperCase()}`] || process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env[`AWS_SECRET_ACCESS_KEY_${environment.toUpperCase()}`] || process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env[`AWS_REGION_${environment.toUpperCase()}`] || process.env.AWS_REGION || 'us-east-1';

  if (!accessKeyId || !secretAccessKey) {
    console.warn(`[${environment}] AWS credentials not fully configured. Remediation actions may fail.`);
  }

  return { accessKeyId, secretAccessKey, region };
};

// Placeholder for Lambda invocation - replace with actual invocation logic later
async function invokeRestartLambda(instanceId: string, environment: string): Promise<{ success: boolean; message: string }> {
  console.log(`[${environment}] Simulating Lambda invocation to restart instance: ${instanceId}`);
  // Simulate checking credentials before proceeding
  const credentials = getAWSCredentials(environment);
  if (!credentials.accessKeyId || !credentials.secretAccessKey) {
      return { success: false, message: `AWS credentials for ${environment} environment not configured. Cannot invoke Lambda.` };
  }

  // Simulate Lambda invocation (replace with actual AWS.Lambda.invoke call)
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

  // In a real scenario, you'd check the Lambda response
  const lambdaSuccess = Math.random() > 0.1; // Simulate 90% success rate

  if (lambdaSuccess) {
    console.log(`[${environment}] Simulated Lambda successfully initiated restart for instance: ${instanceId}`);
    return { success: true, message: `Restart initiated for instance ${instanceId}.` };
  } else {
    console.error(`[${environment}] Simulated Lambda failed to restart instance: ${instanceId}`);
    return { success: false, message: `Failed to initiate restart for instance ${instanceId}. Check Lambda logs.` };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { instanceId, environment = 'dev' } = body;

    if (!instanceId) {
      return NextResponse.json({ error: 'Missing required field: instanceId' }, { status: 400 });
    }

    console.log(`Received request to restart EC2 instance ${instanceId} in ${environment} environment.`);

    // Invoke the Lambda function (currently simulated)
    const result = await invokeRestartLambda(instanceId, environment);

    if (result.success) {
      return NextResponse.json({ message: result.message });
    } else {
      // Return a server error status if the Lambda invocation failed
      return NextResponse.json({ error: result.message }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Error in EC2 restart API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process EC2 restart request' },
      { status: 500 }
    );
  }
}
