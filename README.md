# AWS TGSAIOps Dashboard

A comprehensive dashboard for managing AWS resources with TGSAIOps capabilities.

## Overview

The AWS AIOps Dashboard provides a unified interface for managing AWS resources across multiple environments (Dev, UAT, Prod). It combines monitoring, management, and automation features to help you efficiently manage your AWS infrastructure.

## Features

- **Environment Management**: Switch between different AWS environments (Dev, UAT, Prod)
- **Resource Discovery**: Discover and visualize AWS resources
- **Stack Management**: Create and manage CloudFormation stacks
- **Anomaly Detection**: Detect and respond to anomalies in your AWS environment
- **Cost & Security Monitoring**: Monitor costs and security issues
- **Automation**: Create and manage automation rules
- **Trusted Advisor**: Get environment-specific recommendations
- **Health Dashboard**: Monitor the health of AWS services
- **User Management**: Manage user access to the dashboard

## Pages

- Dashboard
- Discover Resources
- Manage Stacks
- Anomaly Detection
- Cost & Security
- Automation
- Explore AWS
- Solutions
- AWS Blog
- Trusted Advisor
- Health Dashboard
- User Management
- Settings

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **State Management**: React Context API
- **API**: Next.js API Routes

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/aws-aiops-dashboard.git
   cd aws-aiops-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the dashboard.

## Environment Configuration

The dashboard supports multiple AWS environments. You can configure these environments in the `EnvironmentContext.tsx` file.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
