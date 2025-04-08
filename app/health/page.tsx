"use client";

import { useState } from 'react';
import Icon from '../components/Icon';
import { useEnvironment } from '../context/EnvironmentContext';

interface ServiceHealth {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  lastUpdated: string;
  category: string;
}

interface HealthEvent {
  id: string;
  title: string;
  description: string;
  affectedServices: string[];
  startTime: string;
  endTime?: string;
  status: 'ongoing' | 'resolved';
  impact: 'none' | 'low' | 'medium' | 'high' | 'critical';
}

export default function HealthDashboardPage() {
  const { currentEnv } = useEnvironment();
  const [activeTab, setActiveTab] = useState<'services' | 'events'>('services');
  const [filter, setFilter] = useState<string>('all');

  const [services] = useState<ServiceHealth[]>([
    {
      id: 'ec2',
      name: 'Amazon EC2',
      status: 'operational',
      lastUpdated: '2025-04-07T15:30:00Z',
      category: 'compute'
    },
    {
      id: 's3',
      name: 'Amazon S3',
      status: 'operational',
      lastUpdated: '2025-04-07T15:30:00Z',
      category: 'storage'
    },
    {
      id: 'rds',
      name: 'Amazon RDS',
      status: 'operational',
      lastUpdated: '2025-04-07T15:30:00Z',
      category: 'database'
    },
    {
      id: 'lambda',
      name: 'AWS Lambda',
      status: 'operational',
      lastUpdated: '2025-04-07T15:30:00Z',
      category: 'compute'
    },
    {
      id: 'cloudfront',
      name: 'Amazon CloudFront',
      status: 'degraded',
      lastUpdated: '2025-04-07T14:15:00Z',
      category: 'networking'
    },
    {
      id: 'dynamodb',
      name: 'Amazon DynamoDB',
      status: 'operational',
      lastUpdated: '2025-04-07T15:30:00Z',
      category: 'database'
    },
    {
      id: 'route53',
      name: 'Amazon Route 53',
      status: 'operational',
      lastUpdated: '2025-04-07T15:30:00Z',
      category: 'networking'
    },
    {
      id: 'sqs',
      name: 'Amazon SQS',
      status: 'operational',
      lastUpdated: '2025-04-07T15:30:00Z',
      category: 'application-integration'
    },
    {
      id: 'sns',
      name: 'Amazon SNS',
      status: 'operational',
      lastUpdated: '2025-04-07T15:30:00Z',
      category: 'application-integration'
    },
    {
      id: 'cloudwatch',
      name: 'Amazon CloudWatch',
      status: 'operational',
      lastUpdated: '2025-04-07T15:30:00Z',
      category: 'management'
    }
  ]);

  const [events] = useState<HealthEvent[]>([
    {
      id: 'event-1',
      title: 'CloudFront Increased Error Rates',
      description: 'We are investigating increased error rates for CloudFront distributions in the US-EAST-1 region.',
      affectedServices: ['cloudfront'],
      startTime: '2025-04-07T14:15:00Z',
      status: 'ongoing',
      impact: 'medium'
    },
    {
      id: 'event-2',
      title: 'EC2 API Latency',
      description: 'We experienced increased API latency for EC2 in the US-WEST-2 region.',
      affectedServices: ['ec2'],
      startTime: '2025-04-06T10:30:00Z',
      endTime: '2025-04-06T12:45:00Z',
      status: 'resolved',
      impact: 'low'
    },
    {
      id: 'event-3',
      title: 'S3 Increased Error Rates',
      description: 'We experienced increased error rates for S3 in the EU-WEST-1 region.',
      affectedServices: ['s3'],
      startTime: '2025-04-05T08:15:00Z',
      endTime: '2025-04-05T09:30:00Z',
      status: 'resolved',
      impact: 'medium'
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'compute', name: 'Compute' },
    { id: 'storage', name: 'Storage' },
    { id: 'database', name: 'Database' },
    { id: 'networking', name: 'Networking & Content Delivery' },
    { id: 'application-integration', name: 'Application Integration' },
    { id: 'management', name: 'Management & Governance' }
  ];

  const filteredServices = filter === 'all'
    ? services
    : services.filter(service => service.category === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-700 border-green-300';
      case 'degraded': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'outage': return 'bg-red-100 text-red-700 border-red-300';
      case 'maintenance': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational': return 'Operational';
      case 'degraded': return 'Degraded';
      case 'outage': return 'Outage';
      case 'maintenance': return 'Maintenance';
      default: return 'Unknown';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'none': return 'bg-green-100 text-green-700';
      case 'low': return 'bg-blue-100 text-blue-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'critical': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <main className="p-8 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">AWS Health Dashboard</h1>
        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200">
          Environment: {currentEnv.name} ({currentEnv.region})
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Open Issues</h3>
          <div className="flex justify-between items-end">
            <p className="text-2xl font-bold text-yellow-600">1</p>
            <p className="text-xs text-gray-500">Last 7 days</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Scheduled Changes</h3>
          <div className="flex justify-between items-end">
            <p className="text-2xl font-bold text-blue-600">0</p>
            <p className="text-xs text-gray-500">Upcoming and past 7 days</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Other Notifications</h3>
          <div className="flex justify-between items-end">
            <p className="text-2xl font-bold text-gray-600">0</p>
            <p className="text-xs text-gray-500">Past 7 days</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Service Status</h3>
          <div className="flex justify-between items-end">
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
              <p className="text-sm font-medium">9/10 Operational</p>
            </div>
            <p className="text-xs text-gray-500">Current</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'services'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            Service Status
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'events'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            Health Events
          </button>
        </div>

        {activeTab === 'services' && (
          <div className="p-4">
            <div className="mb-4">
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Category
              </label>
              <select
                id="category-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm w-full md:w-64"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredServices.map(service => (
                    <tr key={service.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {service.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(service.status)}`}>
                          {getStatusText(service.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(service.lastUpdated)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="p-4">
            <div className="space-y-4">
              {events.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No health events found.</p>
              ) : (
                events.map(event => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="mr-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          event.status === 'ongoing' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {event.status === 'ongoing' ? 'Ongoing' : 'Resolved'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 mb-1">{event.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {event.affectedServices.map(service => {
                            const serviceInfo = services.find(s => s.id === service);
                            return (
                              <span key={service} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {serviceInfo?.name || service}
                              </span>
                            );
                          })}
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <div>
                            <span>Started: {formatDate(event.startTime)}</span>
                            {event.endTime && (
                              <span className="ml-2">Ended: {formatDate(event.endTime)}</span>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded ${getImpactColor(event.impact)}`}>
                            Impact: {event.impact.charAt(0).toUpperCase() + event.impact.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
