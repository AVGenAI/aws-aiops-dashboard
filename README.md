# AWS TGSAIOps Dashboard

A comprehensive dashboard for managing and monitoring AWS resources with AIOps capabilities.

## Features

- Complete AWS Console-like experience with multiple pages and tabs
- Environment selector (Dev, UAT, Prod) that affects data displayed across the application
- Dashboard with overview cards and quick access links
- Resource discovery and visualization
- Stack management capabilities
- Anomaly detection with enable/disable functionality
- Root Cause Analysis (RCA) for anomalies with AI-powered insights
- Predictive Analytics with SageMaker integration for resource utilization forecasting
- Cost and security monitoring
- Automation rules management with create/edit/delete capabilities
- User management with add/edit/delete functionality
- Explore AWS section with guides and resources
- Solutions catalog organized by categories
- AWS Blog section with recent announcements
- Trusted Advisor with environment-specific recommendations
- Health Dashboard showing service status and health events
- Settings page with AWS credentials, notifications, and preferences
- Bedrock Studio for interacting with Amazon Bedrock models
- AWS Services dashboard for monitoring CloudWatch metrics

## Version Information

### Current Version: 4.0.0 (April 8, 2025)

This version enhances the AWS AIOps Dashboard with advanced AI capabilities, including Root Cause Analysis for anomalies and Predictive Analytics for resource utilization forecasting, providing deeper insights and proactive management of AWS resources.

### Version History

- **v4.0.0** (April 8, 2025): Added Root Cause Analysis and Predictive Analytics features
- **v3.0.0** (April 8, 2025): Added Bedrock Studio and AWS Services dashboard
- **v2.0.0** (March 15, 2025): Added Anomaly Detection and Cost & Security features
- **v1.0.0** (February 1, 2025): Initial release with basic AWS management capabilities

## Branch Information

The repository maintains several branches for different purposes:

- **main**: Stable production-ready code, tagged with version numbers
- **develop**: Integration branch for features in development
- **feature/\***: Individual feature branches (e.g., feature/predictive-analytics)
- **hotfix/\***: Branches for urgent fixes to production
- **release/\***: Branches for preparing new releases

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- AWS account with appropriate permissions

### Installation

#### Option 1: Install Latest Release (v4.0.0)

1. Clone the repository and checkout the latest release tag:
   ```bash
   git clone https://github.com/AVGenAI/aws-aiops-dashboard.git
   cd aws-aiops-dashboard
   git checkout v4.0.0
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up AWS credentials:
   - Create a `.env.local` file in the root directory (see Environment Configuration section below)

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Option 2: Install Specific Version

1. Clone the repository:
   ```bash
   git clone https://github.com/AVGenAI/aws-aiops-dashboard.git
   cd aws-aiops-dashboard
   ```

2. List available tags:
   ```bash
   git tag -l
   ```

3. Checkout the desired version:
   ```bash
   git checkout v3.0.0  # Replace with your desired version
   ```

4. Follow steps 2-5 from Option 1 above.

#### Option 3: Install from Development Branch

1. Clone the repository and checkout the develop branch:
   ```bash
   git clone https://github.com/AVGenAI/aws-aiops-dashboard.git
   cd aws-aiops-dashboard
   git checkout develop
   ```

2. Follow steps 2-5 from Option 1 above.

### Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```
# Default AWS credentials
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1

# Environment-specific AWS credentials (optional)
AWS_ACCESS_KEY_ID_DEV=your_dev_access_key
AWS_SECRET_ACCESS_KEY_DEV=your_dev_secret_key
AWS_REGION_DEV=us-east-1

AWS_ACCESS_KEY_ID_UAT=your_uat_access_key
AWS_SECRET_ACCESS_KEY_UAT=your_uat_secret_key
AWS_REGION_UAT=us-east-1

AWS_ACCESS_KEY_ID_PROD=your_prod_access_key
AWS_SECRET_ACCESS_KEY_PROD=your_prod_secret_key
AWS_REGION_PROD=us-east-1

# Amazon Bedrock settings (required for RCA feature)
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0

# SageMaker settings (optional, for Predictive Analytics feature)
SAGEMAKER_ENDPOINT_NAME=your_sagemaker_endpoint  # Optional, uses mock data if not provided
```

You can copy the `.env.local.example` file and modify it with your credentials:
```bash
cp .env.local.example .env.local
```

### Feature-Specific Requirements

#### Root Cause Analysis (RCA) Feature (v4.0.0+)

The RCA feature requires access to Amazon Bedrock. Your AWS credentials must have the following permissions:

- `bedrock:InvokeModel`
- `cloudwatch:GetMetricData`
- `cloudwatch:ListMetrics`

If these permissions are not available, the feature will use mock data.

#### Predictive Analytics Feature (v4.0.0+)

The Predictive Analytics feature can work in two modes:

1. **Basic Mode**: Uses CloudWatch data and simple forecasting algorithms built into the application.
   - Requires: `cloudwatch:GetMetricStatistics` permission

2. **Advanced Mode**: Uses Amazon SageMaker for more sophisticated time-series forecasting.
   - Requires: `sagemaker:InvokeEndpoint` permission
   - Requires a configured SageMaker endpoint (specified in `.env.local`)

If these permissions are not available, the feature will use mock data.

## Build and Deployment

### Development Build

```bash
npm run dev
```

This starts the development server with hot-reloading enabled.

### Production Build

```bash
npm run build
npm start
```

This creates an optimized production build and starts the server.

### Static Export

```bash
npm run build
npm run export
```

This creates a static export that can be deployed to any static hosting service.

## Troubleshooting

### Common Issues

#### "Cannot find module" errors

If you encounter module not found errors, try:
```bash
npm install
```

#### AWS API errors

If you see AWS API errors:
1. Check your AWS credentials in `.env.local`
2. Verify that your AWS user has the necessary permissions
3. Check if you're hitting AWS service quotas or limits

#### SageMaker endpoint errors

If the Predictive Analytics feature shows errors:
1. Verify your SageMaker endpoint is correctly configured and running
2. Check that your AWS user has permission to invoke the endpoint
3. If you don't have a SageMaker endpoint, remove the `SAGEMAKER_ENDPOINT_NAME` from `.env.local` to use mock data

#### Port already in use

If port 3000 is already in use:
1. Kill the process using the port: `npx kill-port 3000`
2. Or start the server on a different port: `npm run dev -- -p 3001`

## AWS Services Integration

The dashboard integrates with the following AWS services:

### Amazon Bedrock

The Bedrock Studio feature and Root Cause Analysis feature allow you to interact with various foundation models available in Amazon Bedrock. To use these features, your AWS credentials must have permissions to access the Bedrock service.

Required permissions:
- `bedrock:ListFoundationModels`
- `bedrock:InvokeModel`

### Amazon CloudWatch

The AWS Services dashboard displays CloudWatch metrics for various AWS services. To use this feature, your AWS credentials must have permissions to access CloudWatch.

Required permissions:
- `cloudwatch:GetMetricData`
- `cloudwatch:GetMetricStatistics`
- `cloudwatch:ListMetrics`

### Amazon SageMaker

The Predictive Analytics feature can use SageMaker for time-series forecasting. To use this feature in advanced mode, your AWS credentials must have permissions to access SageMaker.

Required permissions:
- `sagemaker:InvokeEndpoint`

## Environment Selector

The dashboard includes an environment selector that allows you to switch between different AWS environments (Dev, UAT, Prod). Each environment can use different AWS credentials, which are specified in the `.env.local` file.

## Fallback to Mock Data

If AWS credentials are not available or do not have the required permissions, the dashboard will fall back to using mock data. This allows you to explore the features of the dashboard without a valid AWS account.

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
