# AWS AIOps Dashboard Architecture Diagrams

This directory contains architecture diagrams and documentation for the AWS AIOps Dashboard project. These diagrams provide a visual representation of the system's components, their relationships, and data flows.

## Available Diagrams

1. **[Overall Architecture](aws-aiops-dashboard-architecture.md)** - A comprehensive view of the entire system architecture, including all layers from the client browser to AWS services.

2. **[AIOps Features Architecture](aws-aiops-features-architecture.md)** - A detailed look at the AIOps-specific features: Anomaly Detection, Root Cause Analysis, and Predictive Analytics.

3. **[Architecture Components](aws-aiops-dashboard-architecture.txt)** - A text-based description of all architecture components, connections, and styling recommendations for creating a detailed draw.io diagram.

## Viewing the Diagrams

The diagrams are created using Mermaid, a markdown-based diagramming tool. There are several ways to view these diagrams:

### Option 1: GitHub Rendering

If you push these files to a GitHub repository, GitHub will automatically render the Mermaid diagrams in the markdown files.

### Option 2: VS Code Extension

Install the "Markdown Preview Mermaid Support" extension in VS Code to view the diagrams directly in the VS Code markdown preview.

### Option 3: Mermaid Live Editor

1. Copy the Mermaid code (the content between the \`\`\`mermaid and \`\`\` tags)
2. Paste it into the [Mermaid Live Editor](https://mermaid.live/)
3. View and export the diagram in various formats (PNG, SVG, etc.)

### Option 4: Draw.io

For more customized diagrams:

1. Use the text description in `aws-aiops-dashboard-architecture.txt` as a guide
2. Create a new diagram in [draw.io](https://app.diagrams.net/)
3. Add the components and connections as described
4. Use AWS Architecture Icons for AWS services (available in draw.io)

## Architecture Overview

The AWS AIOps Dashboard is built with the following key layers:

1. **Client Layer** - Web browser interface
2. **Frontend Layer** - Next.js components, pages, and visualizations
3. **Backend Layer** - Next.js API routes
4. **AWS Integration Layer** - AWS SDK, credential management, and mock data generators
5. **AWS Services** - Bedrock, CloudWatch, SageMaker, and other AWS services

The architecture is designed to be flexible, with fallback mechanisms that allow the dashboard to function even without AWS credentials by using mock data generators.

## Key Features

The dashboard includes several AIOps features:

1. **Anomaly Detection** - Identifies unusual patterns in CloudWatch metrics
2. **Root Cause Analysis (RCA)** - Uses Amazon Bedrock to analyze anomalies and suggest potential causes
3. **Predictive Analytics** - Forecasts resource utilization using SageMaker or built-in algorithms
4. **Bedrock Studio** - Interface for interacting with Amazon Bedrock models
5. **AWS Services Dashboard** - Monitoring dashboard for CloudWatch metrics

Each feature is implemented with a combination of frontend components, API routes, and AWS service integrations, with fallback mechanisms for when AWS credentials aren't available.
