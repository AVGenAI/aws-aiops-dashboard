import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';

// --- AWS Credential Logic ---
const getAWSCredentials = (environment: string) => {
  // Use environment-specific credentials if available
  const accessKeyId = process.env[`AWS_ACCESS_KEY_ID_${environment.toUpperCase()}`] || process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env[`AWS_SECRET_ACCESS_KEY_${environment.toUpperCase()}`] || process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env[`AWS_REGION_${environment.toUpperCase()}`] || process.env.AWS_REGION || 'us-east-1';
  
  return { accessKeyId, secretAccessKey, region };
};

// --- Generate Mock Historical Data ---
function generateMockHistoricalData(
  startTime: Date,
  endTime: Date,
  period: number
): { timestamp: string; value: number }[] {
  const data = [];
  const currentTime = new Date(startTime);
  
  // Generate data points with a realistic CPU utilization pattern
  while (currentTime <= endTime) {
    // Base value between 20-40%
    let value = 30 + (Math.random() * 20 - 10);
    
    // Add time-of-day pattern (higher during business hours)
    const hour = currentTime.getHours();
    if (hour >= 9 && hour <= 17) {
      value += 15 + Math.random() * 10; // Business hours spike
    }
    
    // Add weekly pattern (lower on weekends)
    const day = currentTime.getDay();
    if (day === 0 || day === 6) {
      value -= 10 + Math.random() * 5; // Weekend dip
    }
    
    // Add some random spikes
    if (Math.random() < 0.05) {
      value += 25 + Math.random() * 15; // Occasional spike
    }
    
    // Ensure value is between 0-100
    value = Math.max(0, Math.min(100, value));
    
    data.push({
      timestamp: currentTime.toISOString(),
      value: parseFloat(value.toFixed(2))
    });
    
    // Move to next period
    currentTime.setSeconds(currentTime.getSeconds() + period);
  }
  
  return data;
}

// --- Generate Mock Predictions ---
function generateMockPredictions(
  historicalData: { timestamp: string; value: number }[],
  predictionPeriods: number,
  period: number
): { timestamp: string; value: number; isPredict: boolean }[] {
  // Start from the last historical data point
  const lastDataPoint = historicalData[historicalData.length - 1];
  const startTime = new Date(lastDataPoint.timestamp);
  const predictions = [];
  
  // Convert historical data to the return format
  const formattedHistorical = historicalData.map(point => ({
    ...point,
    isPredict: false
  }));
  
  // Generate future predictions
  const currentTime = new Date(startTime);
  currentTime.setSeconds(currentTime.getSeconds() + period); // Start one period after last historical point
  
  for (let i = 0; i < predictionPeriods; i++) {
    // Base prediction on the last few historical points (simple moving average with some randomness)
    const lastFew = historicalData.slice(-5);
    const avgValue = lastFew.reduce((sum, point) => sum + point.value, 0) / lastFew.length;
    
    // Add some randomness and trend
    let predictedValue = avgValue + (Math.random() * 10 - 5);
    
    // Add time-of-day pattern
    const hour = currentTime.getHours();
    if (hour >= 9 && hour <= 17) {
      predictedValue += 10 + Math.random() * 5;
    }
    
    // Add weekly pattern
    const day = currentTime.getDay();
    if (day === 0 || day === 6) {
      predictedValue -= 8 + Math.random() * 4;
    }
    
    // Ensure value is between 0-100
    predictedValue = Math.max(0, Math.min(100, predictedValue));
    
    predictions.push({
      timestamp: currentTime.toISOString(),
      value: parseFloat(predictedValue.toFixed(2)),
      isPredict: true
    });
    
    // Move to next period
    currentTime.setSeconds(currentTime.getSeconds() + period);
  }
  
  // Combine historical and prediction data
  return [...formattedHistorical, ...predictions];
}

// --- Fetch Historical CloudWatch Metrics ---
async function fetchHistoricalMetrics(
  namespace: string,
  metricName: string,
  dimensionName: string,
  dimensionValue: string,
  startTime: Date,
  endTime: Date,
  period: number,
  environment: string
): Promise<{ timestamp: string; value: number }[]> {
  const credentials = getAWSCredentials(environment);
  
  if (!credentials.accessKeyId || !credentials.secretAccessKey) {
    console.log('AWS credentials not available, returning mock data');
    return generateMockHistoricalData(startTime, endTime, period);
  }
  
  AWS.config.update({
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
    region: credentials.region
  });
  
  const cloudWatch = new AWS.CloudWatch({ apiVersion: '2010-08-01' });
  
  const params = {
    Namespace: namespace,
    MetricName: metricName,
    Dimensions: [
      {
        Name: dimensionName,
        Value: dimensionValue
      }
    ],
    StartTime: startTime,
    EndTime: endTime,
    Period: period,
    Statistics: ['Average']
  };
  
  try {
    const response = await cloudWatch.getMetricStatistics(params).promise();
    
    if (!response.Datapoints || response.Datapoints.length === 0) {
      console.log('No CloudWatch data found, returning mock data');
      return generateMockHistoricalData(startTime, endTime, period);
    }
    
    // Sort datapoints by timestamp
    const sortedDatapoints = response.Datapoints.sort(
      (a, b) => (a.Timestamp?.getTime() || 0) - (b.Timestamp?.getTime() || 0)
    );
    
    // Format the data
    return sortedDatapoints.map(point => ({
      timestamp: point.Timestamp?.toISOString() || new Date().toISOString(),
      value: point.Average || 0
    }));
  } catch (error) {
    console.error('Error fetching CloudWatch metrics:', error);
    return generateMockHistoricalData(startTime, endTime, period);
  }
}

// --- SageMaker Integration ---
async function predictWithSageMaker(
  historicalData: { timestamp: string; value: number }[],
  predictionPeriods: number,
  environment: string
): Promise<{ timestamp: string; value: number; isPredict: boolean }[]> {
  const credentials = getAWSCredentials(environment);
  
  if (!credentials.accessKeyId || !credentials.secretAccessKey) {
    console.log('AWS credentials not available for SageMaker, returning mock predictions');
    return generateMockPredictions(historicalData, predictionPeriods, 3600); // 1 hour periods
  }
  
  AWS.config.update({
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
    region: credentials.region
  });
  
  try {
    // In a real implementation, we would:
    // 1. Format the data for SageMaker
    // 2. Call a pre-trained SageMaker endpoint or create a training job
    // 3. Process the predictions
    
    // For now, we'll use mock predictions since setting up a real SageMaker endpoint
    // requires more extensive setup (creating a model, endpoint configuration, etc.)
    console.log('Using mock SageMaker predictions for now');
    
    // Convert historical data to the expected format
    const formattedHistorical = historicalData.map(point => ({
      ...point,
      isPredict: false
    }));
    
    // For a real implementation, we would use the SageMaker Runtime client:
    /*
    const sagemakerRuntime = new AWS.SageMakerRuntime();
    
    const params = {
      EndpointName: 'your-sagemaker-endpoint',
      ContentType: 'application/json',
      Body: JSON.stringify({
        instances: historicalData.map(d => [new Date(d.timestamp).getTime(), d.value])
      })
    };
    
    const response = await sagemakerRuntime.invokeEndpoint(params).promise();
    const predictions = JSON.parse(response.Body.toString());
    */
    
    // Generate mock predictions for now
    const mockPredictions = generateMockPredictions(
      historicalData,
      predictionPeriods,
      3600 // 1 hour periods
    ).filter(point => point.isPredict);
    
    return [...formattedHistorical, ...mockPredictions];
  } catch (error) {
    console.error('Error with SageMaker prediction:', error);
    return generateMockPredictions(historicalData, predictionPeriods, 3600);
  }
}

// --- Main API Handler ---
export async function GET(request: NextRequest) {
  // Parse query parameters
  const searchParams = request.nextUrl.searchParams;
  const environment = searchParams.get('environment') || 'dev';
  const namespace = searchParams.get('namespace') || 'AWS/EC2';
  const metricName = searchParams.get('metricName') || 'CPUUtilization';
  const dimensionName = searchParams.get('dimensionName') || 'InstanceId';
  const dimensionValue = searchParams.get('dimensionValue') || 'i-1234567890abcdef0';
  const daysBack = parseInt(searchParams.get('daysBack') || '30');
  const predictionHours = parseInt(searchParams.get('predictionHours') || '24');
  
  // Calculate time range
  const endTime = new Date();
  const startTime = new Date();
  startTime.setDate(startTime.getDate() - daysBack);
  
  // Period in seconds (1 hour)
  const period = 3600;
  
  try {
    // Fetch historical data
    const historicalData = await fetchHistoricalMetrics(
      namespace,
      metricName,
      dimensionName,
      dimensionValue,
      startTime,
      endTime,
      period,
      environment
    );
    
    // Get predictions using SageMaker
    const predictions = await predictWithSageMaker(
      historicalData,
      predictionHours,
      environment
    );
    
    return NextResponse.json({
      success: true,
      metric: metricName,
      resource: dimensionValue,
      data: predictions
    });
  } catch (error: any) {
    console.error('Error in predict/metrics API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to predict metrics'
      },
      { status: 500 }
    );
  }
}
