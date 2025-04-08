import { NextResponse } from 'next/server';
import {
  CloudFormationClient,
  DeleteStackCommand,
} from "@aws-sdk/client-cloudformation";

const config = { region: process.env.AWS_REGION || "us-east-1" };
const cfnClient = new CloudFormationClient(config);

// DELETE: Delete stack
export async function DELETE(
  request: Request,
  { params }: { params: { stackName: string } }
) {
  try {
    const stackName = params.stackName;

    if (!stackName) {
      return NextResponse.json({ error: 'Missing stackName' }, { status: 400 });
    }

    const command = new DeleteStackCommand({
      StackName: stackName,
    });

    await cfnClient.send(command);

    return NextResponse.json({ message: 'Stack deletion initiated' }, { status: 202 });
  } catch (error: any) {
    console.error("Error deleting stack:", error);
    return NextResponse.json({ error: error.message || 'Failed to delete stack' }, { status: 500 });
  }
}
