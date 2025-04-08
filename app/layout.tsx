import './globals.css';
import Link from 'next/link';
import type { ReactNode } from 'react';
import Icon from './components/Icon';
import EnvironmentSelector from './components/EnvironmentSelector';
import { EnvironmentProvider } from './context/EnvironmentContext';

export const metadata = {
  title: 'AWS TGSAIOps Dashboard',
  description: 'Manage and monitor your AWS environment with TGSAIOps capabilities',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen font-sans text-sm">
        <EnvironmentProvider>
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">TGSAIOps Dashboard</h2>
          </div>
          <nav className="flex-1 p-2 space-y-1">
            <Link href="/dashboard" className="flex items-center rounded px-3 py-2 hover:bg-gray-700 hover:text-white">
              <Icon service="dashboard" className="mr-2" /> Dashboard
            </Link>
            <Link href="/discover" className="flex items-center rounded px-3 py-2 hover:bg-gray-700 hover:text-white">
              <Icon service="discover" className="mr-2" /> Discover Resources
            </Link>
            <Link href="/stacks" className="flex items-center rounded px-3 py-2 hover:bg-gray-700 hover:text-white">
              <Icon service="stacks" className="mr-2" /> Manage Stacks
            </Link>
            <Link href="/anomalies" className="flex items-center rounded px-3 py-2 hover:bg-gray-700 hover:text-white">
              <Icon service="anomalies" className="mr-2" /> Anomaly Detection
            </Link>
            <Link href="/cost-security" className="flex items-center rounded px-3 py-2 hover:bg-gray-700 hover:text-white">
              <Icon service="security" className="mr-2" /> Cost & Security
            </Link>
            <Link href="/automation" className="flex items-center rounded px-3 py-2 hover:bg-gray-700 hover:text-white">
              <Icon service="automation" className="mr-2" /> Automation
            </Link>
            <Link href="/bedrock-studio" className="flex items-center rounded px-3 py-2 hover:bg-gray-700 hover:text-white">
              <Icon service="bedrock" className="mr-2" /> Bedrock Studio
            </Link>
            <Link href="/explore" className="flex items-center rounded px-3 py-2 hover:bg-gray-700 hover:text-white">
              <Icon service="discover" className="mr-2" /> Explore AWS
            </Link>
            <Link href="/solutions" className="flex items-center rounded px-3 py-2 hover:bg-gray-700 hover:text-white">
              <Icon service="cloudformation" className="mr-2" /> Solutions
            </Link>
            <Link href="/blog" className="flex items-center rounded px-3 py-2 hover:bg-gray-700 hover:text-white">
              <Icon service="cloudwatch" className="mr-2" /> AWS Blog
            </Link>
            <Link href="/advisor" className="flex items-center rounded px-3 py-2 hover:bg-gray-700 hover:text-white">
              <Icon service="cost" className="mr-2" /> Trusted Advisor
            </Link>
            <Link href="/health" className="flex items-center rounded px-3 py-2 hover:bg-gray-700 hover:text-white">
              <Icon service="health" className="mr-2" /> Health Dashboard
            </Link>
            <Link href="/users" className="flex items-center rounded px-3 py-2 hover:bg-gray-700 hover:text-white">
              <Icon service="users" className="mr-2" /> User Management
            </Link>
            <Link href="/settings" className="flex items-center rounded px-3 py-2 hover:bg-gray-700 hover:text-white">
              <Icon service="settings" className="mr-2" /> Settings
            </Link>
          </nav>
          <div className="p-4 border-t border-gray-700 text-xs">
            <p>User: admin@example.com</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-300 p-3 flex justify-between items-center shadow-sm">
            <div className="flex items-center">
              {/* Placeholder for Search */}
              <input type="text" placeholder="Search..." className="border border-gray-300 rounded px-3 py-1 text-sm mr-4" />
            </div>
            <div className="flex items-center space-x-4">
              <EnvironmentSelector />
              {/* Placeholder for User Menu */}
              <button className="text-sm text-gray-700">admin@example.com ▼</button>
            </div>
          </header>
          {/* Page Content */}
          <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">{children}</main>
        </div>
        </EnvironmentProvider>
      </body>
    </html>
  );
}
