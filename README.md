# AWS TGSAIOps Dashboard

A comprehensive dashboard for managing and monitoring AWS resources with AIOps capabilities.

## Features

- Complete AWS Console-like experience with multiple pages and tabs
- Environment selector (Dev, UAT, Prod) that affects data displayed across the application
- Dashboard with overview cards and quick access links
- Resource discovery and visualization
- Stack management capabilities
- Anomaly detection with enable/disable functionality
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

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- AWS account with appropriate permissions

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AVGenAI/aws-aiops-dashboard.git
   cd aws-aiops-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up AWS credentials:
   - Create a `.env.local` file in the root directory with the following variables:
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
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## AWS Services Integration

The dashboard integrates with the following AWS services:

### Amazon Bedrock

The Bedrock Studio feature allows you to interact with various foundation models available in Amazon Bedrock. To use this feature, your AWS credentials must have permissions to access the Bedrock service.

Required permissions:
- `bedrock:ListFoundationModels`
- `bedrock:InvokeModel`

### Amazon CloudWatch

The AWS Services dashboard displays CloudWatch metrics for various AWS services. To use this feature, your AWS credentials must have permissions to access CloudWatch.

Required permissions:
- `cloudwatch:GetMetricData`
- `cloudwatch:GetMetricStatistics`
- `cloudwatch:ListMetrics`

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
