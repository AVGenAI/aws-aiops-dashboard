import { NextResponse } from 'next/server';
import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2";
import { RDSClient, DescribeDBInstancesCommand } from "@aws-sdk/client-rds";
import { EKSClient, ListClustersCommand } from "@aws-sdk/client-eks";

// Ensure AWS credentials are configured (e.g., via environment variables)
const config = { region: process.env.AWS_REGION || "us-east-1" };
const ec2Client = new EC2Client(config);
const rdsClient = new RDSClient(config);
const eksClient = new EKSClient(config);

export async function GET() {
  try {
    // Fetch EC2 Instances
    const ec2Data = await ec2Client.send(new DescribeInstancesCommand({}));
    const ec2Instances = ec2Data.Reservations?.flatMap(res => res.Instances || [])
      .map(inst => ({
        id: inst?.InstanceId || 'N/A',
        type: 'EC2',
        name: inst?.Tags?.find(tag => tag.Key === 'Name')?.Value || inst?.InstanceId || 'Unnamed',
        status: inst?.State?.Name || 'N/A',
      })) || [];

    // Fetch RDS Instances
    const rdsData = await rdsClient.send(new DescribeDBInstancesCommand({}));
    const rdsInstances = rdsData.DBInstances?.map(db => ({
      id: db?.DBInstanceIdentifier || 'N/A',
      type: 'RDS',
      name: db?.DBInstanceIdentifier || 'Unnamed',
      status: db?.DBInstanceStatus || 'N/A',
    })) || [];

    // Fetch EKS Clusters
    const eksData = await eksClient.send(new ListClustersCommand({}));
    const eksClusters = eksData.clusters?.map(cluster => ({
      id: cluster || 'N/A',
      type: 'EKS',
      name: cluster || 'Unnamed',
      status: 'active', // ListClusters doesn't provide detailed status
    })) || [];

    const allResources = [...ec2Instances, ...rdsInstances, ...eksClusters];

    return NextResponse.json(allResources);
  } catch (error) {
    console.error("Error fetching AWS resources:", error);
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
  }
}
