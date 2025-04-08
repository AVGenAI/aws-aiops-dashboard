import { NextResponse } from 'next/server';
import {
  CostExplorerClient,
  GetCostAndUsageCommand,
  GetCostForecastCommand,
} from "@aws-sdk/client-cost-explorer";

const config = { region: process.env.AWS_REGION || "us-east-1" };
const costClient = new CostExplorerClient(config);

export async function GET() {
  try {
    // Get current date and first day of month
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Format dates for AWS API (YYYY-MM-DD)
    const startDate = firstDayOfMonth.toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];
    
    // Calculate forecast end date (end of month)
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const forecastEndDate = lastDayOfMonth.toISOString().split('T')[0];

    // Get current month cost
    const costCommand = new GetCostAndUsageCommand({
      TimePeriod: {
        Start: startDate,
        End: endDate,
      },
      Granularity: "MONTHLY",
      Metrics: ["UnblendedCost"],
    });
    
    // Get forecast for remainder of month
    const forecastCommand = new GetCostForecastCommand({
      TimePeriod: {
        Start: endDate,
        End: forecastEndDate,
      },
      Granularity: "MONTHLY",
      Metric: "UNBLENDED_COST",
    });

    // Execute both requests in parallel
    const [costResponse, forecastResponse] = await Promise.all([
      costClient.send(costCommand),
      costClient.send(forecastCommand),
    ]);

    // Extract cost data
    const currentCost = costResponse.ResultsByTime?.[0]?.Total?.UnblendedCost?.Amount || "0";
    const currentCostUnit = costResponse.ResultsByTime?.[0]?.Total?.UnblendedCost?.Unit || "USD";
    
    // Extract forecast data
    const forecastAmount = forecastResponse.ForecastResultsByTime?.[0]?.MeanValue || "0";
    const forecastUnit = "USD"; // Cost Explorer always returns USD

    // Calculate total monthly forecast
    const totalForecast = (parseFloat(currentCost) + parseFloat(forecastAmount)).toFixed(2);

    return NextResponse.json({
      currentMonth: {
        amount: parseFloat(currentCost).toFixed(2),
        unit: currentCostUnit,
      },
      forecast: {
        amount: totalForecast,
        unit: forecastUnit,
      },
      period: {
        start: startDate,
        end: forecastEndDate,
      }
    });
  } catch (error: any) {
    console.error("Error fetching cost data:", error);
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch cost data',
      // Return mock data for development if Cost Explorer API is not available
      currentMonth: {
        amount: "123.45",
        unit: "USD",
      },
      forecast: {
        amount: "234.56",
        unit: "USD",
      },
      period: {
        start: new Date().toISOString().split('T')[0],
        end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
      }
    }, { status: 200 });
  }
}
