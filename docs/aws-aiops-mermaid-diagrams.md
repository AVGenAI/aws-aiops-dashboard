# AWS AIOps Mermaid Diagrams

This file contains all the Mermaid diagrams for the AWS AIOps Dashboard architecture and implementation patterns.

## 1. Overall Architecture Diagram

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

## 2. AIOps Features Architecture

```mermaid
flowchart TD
    %% User Interface Components
    subgraph UI["User Interface"]
        TimeSeriesChart["TimeSeriesChart Component"]
        AnomalyCorrelation["AnomalyCorrelation Component"]
        RCADisplay["RCADisplay Component"]
        PredictiveChart["PredictiveChart Component"]
    end
    
    %% API Routes
    subgraph API["API Routes"]
        AnomalyAPI["/api/anomalies"]
        RCAAPI["/api/anomalies/rca"]
        PredictAPI["/api/predict/metrics"]
    end
    
    %% AWS Services
    subgraph AWS["AWS Services"]
        CloudWatch["Amazon CloudWatch"]
        Bedrock["Amazon Bedrock"]
        SageMaker["Amazon SageMaker"]
    end
    
    %% Data Flow for Anomaly Detection
    TimeSeriesChart -->|"1. User clicks on anomaly"| RCAAPI
    AnomalyCorrelation -->|"Shows correlated metrics"| AnomalyAPI
    
    AnomalyAPI -->|"2. Fetch metrics"| CloudWatch
    CloudWatch -->|"3. Return metrics data"| AnomalyAPI
    AnomalyAPI -->|"4. Process & return anomalies"| TimeSeriesChart
    AnomalyAPI -->|"Return correlation data"| AnomalyCorrelation
    
    %% Data Flow for Root Cause Analysis
    RCAAPI -->|"5. Fetch related metrics"| CloudWatch
    CloudWatch -->|"6. Return related metrics"| RCAAPI
    RCAAPI -->|"7. Send prompt with context"| Bedrock
    Bedrock -->|"8. Return AI analysis"| RCAAPI
    RCAAPI -->|"9. Return RCA results"| RCADisplay
    
    %% Data Flow for Predictive Analytics
    PredictiveChart -->|"10. Request predictions"| PredictAPI
    PredictAPI -->|"11. Fetch historical data"| CloudWatch
    CloudWatch -->|"12. Return historical metrics"| PredictAPI
    PredictAPI -->|"13. Send data for prediction"| SageMaker
    SageMaker -->|"14. Return predictions"| PredictAPI
    PredictAPI -->|"15. Return historical + predicted data"| PredictiveChart
    
    %% Fallback paths for when AWS credentials aren't available
    RCAAPI -.->|"5a. No AWS credentials"| MockRCA["Mock RCA Generator"]
    MockRCA -.->|"8a. Return mock analysis"| RCAAPI
    
    PredictAPI -.->|"11a. No AWS credentials"| MockHistory["Mock Historical Data"]
    MockHistory -.->|"12a. Return mock data"| PredictAPI
    
    PredictAPI -.->|"13a. No SageMaker access"| MockPredict["Mock Prediction Generator"]
    MockPredict -.->|"14a. Return mock predictions"| PredictAPI
    
    %% Styling
    classDef ui fill:#d5e8d4,stroke:#82b366
    classDef api fill:#ffe6cc,stroke:#d79b00
    classDef aws fill:#f8cecc,stroke:#b85450
    classDef mock fill:#fff2cc,stroke:#d6b656
    
    class UI,TimeSeriesChart,AnomalyCorrelation,RCADisplay,PredictiveChart ui
    class API,AnomalyAPI,RCAAPI,PredictAPI api
    class AWS,CloudWatch,Bedrock,SageMaker aws
    class MockRCA,MockHistory,MockPredict mock
```

## 3. Anomaly Detection Pattern

```mermaid
flowchart LR
    Sources[AWS Resources & Applications] -->|Metrics & Logs| CloudWatch
    CloudWatch -->|Statistical Analysis| BasicAnomalies[Basic Anomaly Detection]
    CloudWatch -->|Machine Learning| MLAnomalies[ML-based Anomaly Detection]
    BasicAnomalies --> Alerts[Alerts & Notifications]
    MLAnomalies --> Alerts
    Alerts --> Dashboard[AIOps Dashboard]
    Alerts --> Remediation[Automated Remediation]
```

## 4. Root Cause Analysis Pattern

```mermaid
flowchart LR
    Anomaly[Anomaly Detected] -->|Context Collection| Context[Gather Context]
    Context -->|Related Metrics| Metrics[CloudWatch Metrics]
    Context -->|Related Logs| Logs[CloudWatch Logs]
    Context -->|Related Events| Events[CloudWatch Events]
    Metrics & Logs & Events -->|Contextual Data| Bedrock[Amazon Bedrock]
    Bedrock -->|AI Analysis| RCA[Root Cause Analysis]
    RCA -->|Insights| Dashboard[AIOps Dashboard]
    RCA -->|Suggestions| Remediation[Remediation Suggestions]
```

## 5. Predictive Analytics Pattern

```mermaid
flowchart LR
    Sources[AWS Resources & Applications] -->|Historical Metrics| CloudWatch
    CloudWatch -->|Time Series Data| DataPrep[Data Preparation]
    DataPrep -->|Processed Data| SageMaker[Amazon SageMaker]
    SageMaker -->|Training| Model[Forecasting Model]
    Model -->|Predictions| Forecasts[Resource Utilization Forecasts]
    Forecasts -->|Visualization| Dashboard[AIOps Dashboard]
    Forecasts -->|Proactive Actions| Scaling[Auto Scaling]
    Forecasts -->|Capacity Planning| Planning[Capacity Planning]
```

## How to Use These Diagrams

1. **View in GitHub**: If you push this file to a GitHub repository, GitHub will automatically render the Mermaid diagrams.

2. **VS Code Extension**: Install the "Markdown Preview Mermaid Support" extension in VS Code to view the diagrams directly in the VS Code markdown preview.

3. **Mermaid Live Editor**: Copy the Mermaid code (the content between the \`\`\`mermaid and \`\`\` tags) and paste it into the [Mermaid Live Editor](https://mermaid.live/) to view and export the diagrams in various formats.

4. **Draw.io**: Use these diagrams as a reference to create more detailed diagrams in draw.io with AWS architecture icons.
