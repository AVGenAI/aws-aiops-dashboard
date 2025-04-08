# AWS AIOps Dashboard Architecture

Below is a visual representation of the AWS AIOps Dashboard architecture using a Mermaid diagram. This diagram shows the key components and their relationships.

```mermaid
flowchart TD
    %% Client Layer
    subgraph ClientLayer["Client Layer"]
        Browser["Web Browser"]
    end
    
    %% Frontend Layer
    subgraph FrontendLayer["Frontend Layer (Next.js)"]
        UI["UI Components"]
        Pages["Next.js Pages"]
        Charts["Recharts Visualizations"]
        Context["Environment Context"]
    end
    
    %% Backend Layer
    subgraph BackendLayer["Backend Layer (Next.js API Routes)"]
        API["API Routes"]
        Middleware["Request Handlers"]
        Utils["Utility Functions"]
    end
    
    %% AWS Integration Layer
    subgraph AWSIntegrationLayer["AWS Integration Layer"]
        AWSSDK["AWS SDK"]
        Credentials["Credential Management"]
        MockData["Mock Data Generators"]
    end
    
    %% AWS Services
    subgraph AWSServices["AWS Services"]
        Bedrock["Amazon Bedrock"]
        CloudWatch["Amazon CloudWatch"]
        SageMaker["Amazon SageMaker"]
        EC2["AWS EC2"]
        RDS["AWS RDS"]
        SecurityHub["AWS SecurityHub"]
        CostExplorer["AWS Cost Explorer"]
    end
    
    %% Feature-specific components
    subgraph Features["Key Features"]
        AnomalyDetection["Anomaly Detection"]
        RCA["Root Cause Analysis"]
        Predictive["Predictive Analytics"]
        BedrockStudio["Bedrock Studio"]
        AWSServicesDashboard["AWS Services Dashboard"]
    end
    
    %% Connections
    Browser <--> UI
    Browser <--> Pages
    
    UI --> API
    Pages --> API
    Charts --> API
    
    API --> AWSSDK
    API --> MockData
    
    AWSSDK --> Credentials
    AWSSDK --> Bedrock
    AWSSDK --> CloudWatch
    AWSSDK --> SageMaker
    AWSSDK --> EC2
    AWSSDK --> RDS
    AWSSDK --> SecurityHub
    AWSSDK --> CostExplorer
    
    %% Feature connections
    AnomalyDetection --> CloudWatch
    RCA --> Bedrock
    RCA --> CloudWatch
    Predictive --> SageMaker
    Predictive --> CloudWatch
    BedrockStudio --> Bedrock
    AWSServicesDashboard --> CloudWatch
    
    %% Internal connections
    UI <--> Context
    Pages <--> Context
    Charts <--> Context
    
    API --> Middleware
    Middleware --> Utils
    Utils --> AWSSDK
    
    %% Styling
    classDef clientLayer fill:#dae8fc,stroke:#6c8ebf
    classDef frontendLayer fill:#d5e8d4,stroke:#82b366
    classDef backendLayer fill:#ffe6cc,stroke:#d79b00
    classDef awsIntegrationLayer fill:#fff2cc,stroke:#d6b656
    classDef awsServices fill:#f8cecc,stroke:#b85450
    classDef features fill:#e1d5e7,stroke:#9673a6
    
    class ClientLayer,Browser clientLayer
    class FrontendLayer,UI,Pages,Charts,Context frontendLayer
    class BackendLayer,API,Middleware,Utils backendLayer
    class AWSIntegrationLayer,AWSSDK,Credentials,MockData awsIntegrationLayer
    class AWSServices,Bedrock,CloudWatch,SageMaker,EC2,RDS,SecurityHub,CostExplorer awsServices
    class Features,AnomalyDetection,RCA,Predictive,BedrockStudio,AWSServicesDashboard features
```

## Architecture Components Explained

### 1. Client Layer
- **Web Browser**: The user interface where users interact with the dashboard

### 2. Frontend Layer (Next.js)
- **UI Components**: Reusable UI elements (ModelSelector, PromptBuilder, TimeSeriesChart, etc.)
- **Next.js Pages**: Page components for different sections of the dashboard
- **Recharts Visualizations**: Data visualization components
- **Environment Context**: State management for switching between Dev/UAT/Prod environments

### 3. Backend Layer (Next.js API Routes)
- **API Routes**: Server-side endpoints handling data requests
- **Request Handlers**: Logic for processing requests
- **Utility Functions**: Shared functions for AWS credential management, data processing, etc.

### 4. AWS Integration Layer
- **AWS SDK**: Integration with AWS services
- **Credential Management**: Handles environment-specific AWS credentials
- **Mock Data Generators**: Provides realistic mock data when AWS credentials aren't available

### 5. AWS Services
- **Amazon Bedrock**: Powers AI-driven features
- **CloudWatch**: Provides metrics data
- **SageMaker**: Enables predictive analytics
- **Other AWS Services**: EC2, RDS, SecurityHub, CostExplorer, etc.

### 6. Key Features
- **Anomaly Detection**: Identifies unusual patterns in CloudWatch metrics
- **Root Cause Analysis (RCA)**: Uses Bedrock to analyze anomalies
- **Predictive Analytics**: Forecasts resource utilization
- **Bedrock Studio**: Interface for interacting with Amazon Bedrock models
- **AWS Services Dashboard**: Monitoring dashboard for CloudWatch metrics

## Data Flow

1. User interacts with the Next.js frontend through their browser
2. Frontend makes requests to Next.js API routes
3. API routes use AWS SDK to call appropriate AWS services
4. AWS credentials are selected based on the current environment (Dev/UAT/Prod)
5. If AWS credentials aren't available, mock data generators provide realistic sample data
6. Data from AWS services or mock generators is processed and returned to the frontend
7. Frontend renders the data in the UI
