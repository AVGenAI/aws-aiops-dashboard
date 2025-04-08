"use client";

import Link from 'next/link';
import Icon from '../components/Icon';
import { useEnvironment } from '../context/EnvironmentContext';

export default function DashboardPage() {
  const { currentEnv } = useEnvironment();
  return (
    <main className="p-8 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Console Home</h1>
        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200">
          Environment: {currentEnv.name} ({currentEnv.region})
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card Widget */}
        <div className="rounded-lg border border-gray-300 shadow-sm p-4 bg-white">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Icon service="dashboard" className="mr-2" />
              <h2 className="font-semibold text-gray-700">Recently Visited</h2>
            </div>
            <span className="text-gray-400">...</span> {/* Placeholder for options */}
          </div>
          <ul className="space-y-1 text-sm">
            <li><Link href="/discover" className="text-blue-600 hover:underline">Discover Resources</Link></li>
            <li><Link href="/stacks" className="text-blue-600 hover:underline">Manage Stacks</Link></li>
            <li><Link href="/anomalies" className="text-blue-600 hover:underline">Anomaly Detection</Link></li>
            <li><Link href="/users" className="text-blue-600 hover:underline">User Management</Link></li>
          </ul>
        </div>

        {/* Card Widget */}
        <div className="rounded-lg border border-gray-300 shadow-sm p-4 bg-white">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Icon service="cost" className="mr-2" />
              <h2 className="font-semibold text-gray-700">Cost and Usage</h2>
            </div>
            <span className="text-gray-400">...</span>
          </div>
          <p className="mb-1 text-sm">Current month: <span className="font-medium">$0.00</span></p>
          <p className="text-sm">Forecast: <span className="font-medium">$0.00</span></p>
          <a 
            href="https://console.aws.amazon.com/billing/home" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mt-3 text-sm text-blue-600 hover:underline inline-block"
          >
            View Billing
          </a>
        </div>

        {/* Card Widget */}
        <div className="rounded-lg border border-gray-300 shadow-sm p-4 bg-white">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Icon service="stacks" className="mr-2" />
              <h2 className="font-semibold text-gray-700">Applications</h2>
            </div>
            <span className="text-gray-400">...</span>
          </div>
          <p className="text-sm text-gray-600">No applications created yet.</p>
          <Link 
            href="/stacks" 
            className="mt-3 text-sm text-blue-600 hover:underline inline-block"
          >
            Create Application
          </Link>
        </div>

        {/* Card Widget */}
        <div className="rounded-lg border border-gray-300 shadow-sm p-4 bg-white">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Icon service="security" className="mr-2" />
              <h2 className="font-semibold text-gray-700">Security</h2>
            </div>
            <span className="text-gray-400">...</span>
          </div>
          <p className="text-sm text-gray-600">No security issues detected.</p>
          <a 
            href="https://console.aws.amazon.com/securityhub/home" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mt-3 text-sm text-blue-600 hover:underline inline-block"
          >
            Go to Security Hub
          </a>
        </div>

        {/* Card Widget */}
        <div className="rounded-lg border border-gray-300 shadow-sm p-4 bg-white">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Icon service="health" className="mr-2" />
              <h2 className="font-semibold text-gray-700">AWS Health</h2>
            </div>
            <span className="text-gray-400">...</span>
          </div>
          <p className="text-sm text-gray-600">All systems operational.</p>
          <a 
            href="https://health.aws.amazon.com/health/home" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mt-3 text-sm text-blue-600 hover:underline inline-block"
          >
            View Health Dashboard
          </a>
        </div>

        {/* Card Widget */}
        <div className="rounded-lg border border-gray-300 shadow-sm p-4 bg-white">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Icon service="cloudwatch" className="mr-2" />
              <h2 className="font-semibold text-gray-700">Announcements</h2>
            </div>
            <span className="text-gray-400">...</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>New feature released</li>
            <li>Service update</li>
            <li>Maintenance scheduled</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
