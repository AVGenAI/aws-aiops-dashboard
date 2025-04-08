import { NextRequest, NextResponse } from 'next/server';

// Types for time series data
interface TimeSeriesDataPoint {
  timestamp: string;
  value: number;
  status: 'Normal' | 'Warning' | 'Critical';
}

interface TimeSeriesResponse {
  data: TimeSeriesDataPoint[];
  metric: string;
}

// Generate mock time series data based on the metric and time range
function generateMockTimeSeriesData(
  metric: string,
  timeRange: '1h' | '6h' | '1d' | '1w' | '1m',
  environment: string
): TimeSeriesDataPoint[] {
  const now = Date.now();
  const data: TimeSeriesDataPoint[] = [];
  
  // Determine the time interval and number of points based on the time range
  let interval: number;
  let points: number;
  
  switch (timeRange) {
    case '1h':
      interval = 5 * 60 * 1000; // 5 minutes
      points = 12;
      break;
    case '6h':
      interval = 30 * 60 * 1000; // 30 minutes
      points = 12;
      break;
    case '1d':
      interval = 2 * 60 * 60 * 1000; // 2 hours
      points = 12;
      break;
    case '1w':
      interval = 12 * 60 * 60 * 1000; // 12 hours
      points = 14;
      break;
    case '1m':
      interval = 24 * 60 * 60 * 1000; // 1 day
      points = 30;
      break;
    default:
      interval = 2 * 60 * 60 * 1000; // 2 hours
      points = 12;
  }
  
  // Generate data points with a pattern based on the metric
  for (let i = 0; i < points; i++) {
    const timestamp = new Date(now - (points - i) * interval).toISOString();
    let value: number;
    let status: 'Normal' | 'Warning' | 'Critical';
    
    // Different patterns for different metrics
    if (metric.includes('CPU')) {
      // CPU pattern: normal -> spike -> critical -> recovery
      if (i < points * 0.3) {
        value = 25 + Math.random() * 10;
        status = 'Normal';
      } else if (i < points * 0.5) {
        value = 60 + Math.random() * 15;
        status = 'Warning';
      } else if (i < points * 0.7) {
        value = 85 + Math.random() * 10;
        status = 'Critical';
      } else {
        value = 40 + Math.random() * 20;
        status = 'Warning';
      }
    } else if (metric.includes('Memory')) {
      // Memory pattern: gradual increase
      value = 20 + (i / points) * 70 + Math.random() * 10;
      if (value < 60) {
        status = 'Normal';
      } else if (value < 80) {
        status = 'Warning';
      } else {
        status = 'Critical';
      }
    } else if (metric.includes('Latency')) {
      // Latency pattern: spikes
      if (i % 4 === 0) {
        value = 200 + Math.random() * 300;
        status = 'Critical';
      } else if (i % 4 === 1) {
        value = 100 + Math.random() * 100;
        status = 'Warning';
      } else {
        value = 20 + Math.random() * 30;
        status = 'Normal';
      }
    } else if (metric.includes('Error')) {
      // Error rate pattern: occasional spikes
      if (i % 5 === 0) {
        value = 8 + Math.random() * 7;
        status = 'Critical';
      } else if (i % 5 === 1) {
        value = 3 + Math.random() * 4;
        status = 'Warning';
      } else {
        value = Math.random() * 2;
        status = 'Normal';
      }
    } else {
      // Default pattern
      value = 20 + Math.sin(i / (points / 6) * Math.PI) * 60 + Math.random() * 10;
      if (value < 40) {
        status = 'Normal';
      } else if (value < 70) {
        status = 'Warning';
      } else {
        status = 'Critical';
      }
    }
    
    // Add some environment-specific variations
    if (environment === 'prod') {
      // Production has more stable metrics with occasional issues
      if (Math.random() > 0.9) {
        value = value * 1.5;
        status = value > 80 ? 'Critical' : 'Warning';
      } else {
        value = Math.min(value * 0.8, 100);
        status = value > 80 ? 'Critical' : value > 60 ? 'Warning' : 'Normal';
      }
    } else if (environment === 'dev') {
      // Development has more volatile metrics
      value = Math.min(value * (0.7 + Math.random() * 0.6), 100);
      status = value > 80 ? 'Critical' : value > 60 ? 'Warning' : 'Normal';
    }
    
    data.push({
      timestamp,
      value: Math.round(value * 10) / 10, // Round to 1 decimal place
      status
    });
  }
  
  return data;
}

export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const metric = searchParams.get('metric') || 'CPU Utilization';
  const timeRange = (searchParams.get('timeRange') || '1d') as '1h' | '6h' | '1d' | '1w' | '1m';
  const environment = searchParams.get('environment') || 'dev';
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate mock data
    const data = generateMockTimeSeriesData(metric, timeRange, environment);
    
    return NextResponse.json({ 
      data,
      metric
    } as TimeSeriesResponse);
  } catch (error) {
    console.error('Error generating time series data:', error);
    return NextResponse.json(
      { error: 'Failed to generate time series data' },
      { status: 500 }
    );
  }
}
