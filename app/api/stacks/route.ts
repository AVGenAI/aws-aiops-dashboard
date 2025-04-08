import { NextResponse } from 'next/server';
import {
  CloudFormationClient,
  ListStacksCommand,
  CreateStackCommand,
  StackStatus,
} from "@aws-sdk/client-cloudformation";

const config = { region: process.env.AWS_REGION || "us-east-1" };
const cfnClient = new CloudFormationClient(config);

// GET: List stacks
export async function GET() {
  try {
    const command = new ListStacksCommand({
      // Filter out deleted stacks
      StackStatusFilter: Object.values(StackStatus).filter(s => s !== StackStatus.DELETE_COMPLETE),
    });
    const data = await cfnClient.send(command);
    const stacks = data.StackSummaries?.map(s => ({
      id: s.StackId || 'N/A',
      name: s.StackName || 'Unnamed',
      status: s.StackStatus || 'N/A',
    })) || [];
    return NextResponse.json(stacks);
  } catch (error) {
    console.error("Error listing stacks:", error);
    return NextResponse.json({ error: 'Failed to list stacks' }, { status: 500 });
  }
}

// POST: Create stack
export async function POST(request: Request) {
  try {
    const { stackName, templateUrl } = await request.json();

    if (!stackName || !templateUrl) {
      return NextResponse.json({ error: 'Missing stackName or templateUrl' }, { status: 400 });
    }

    const command = new CreateStackCommand({
      StackName: stackName,
      TemplateURL: templateUrl,
      Capabilities: ["CAPABILITY_IAM", "CAPABILITY_NAMED_IAM"], // Add capabilities as needed
    });

    await cfnClient.send(command);

    return NextResponse.json({ message: 'Stack creation initiated' }, { status: 202 });
  } catch (error: any) {
    console.error("Error creating stack:", error);
    return NextResponse.json({ error: error.message || 'Failed to create stack' }, { status: 500 });
  }
}
