"use client";

import { useState } from 'react';
import { useEnvironment, environments } from '../../context/EnvironmentContext';

export default function PreferencesModal() {
  const { selectedEnv, setSelectedEnv } = useEnvironment();
  const [theme, setTheme] = useState('light');
  const [defaultRegion, setDefaultRegion] = useState('us-east-1');
  const [refreshInterval, setRefreshInterval] = useState('60');
  const [showResourceIds, setShowResourceIds] = useState(true);
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Customize application preferences and display settings.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Default Environment
          </label>
          <select
            value={selectedEnv}
            onChange={(e) => setSelectedEnv(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            {environments.map(env => (
              <option key={env.id} value={env.id}>
                {env.name} ({env.region})
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            This environment will be selected by default when you open the application.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Theme
          </label>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="theme-light"
                name="theme"
                value="light"
                checked={theme === 'light'}
                onChange={() => setTheme('light')}
                className="mr-2"
              />
              <label htmlFor="theme-light" className="text-sm">Light</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="theme-dark"
                name="theme"
                value="dark"
                checked={theme === 'dark'}
                onChange={() => setTheme('dark')}
                className="mr-2"
              />
              <label htmlFor="theme-dark" className="text-sm">Dark</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="theme-system"
                name="theme"
                value="system"
                checked={theme === 'system'}
                onChange={() => setTheme('system')}
                className="mr-2"
              />
              <label htmlFor="theme-system" className="text-sm">System</label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Default AWS Region
          </label>
          <select
            value={defaultRegion}
            onChange={(e) => setDefaultRegion(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="us-east-1">US East (N. Virginia)</option>
            <option value="us-east-2">US East (Ohio)</option>
            <option value="us-west-1">US West (N. California)</option>
            <option value="us-west-2">US West (Oregon)</option>
            <option value="eu-west-1">EU (Ireland)</option>
            <option value="eu-central-1">EU (Frankfurt)</option>
            <option value="ap-northeast-1">Asia Pacific (Tokyo)</option>
            <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dashboard Refresh Interval (seconds)
          </label>
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="0">Manual refresh only</option>
            <option value="30">30 seconds</option>
            <option value="60">1 minute</option>
            <option value="300">5 minutes</option>
            <option value="600">10 minutes</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="show-resource-ids"
            checked={showResourceIds}
            onChange={() => setShowResourceIds(!showResourceIds)}
            className="mr-2"
          />
          <label htmlFor="show-resource-ids" className="text-sm">
            Show resource IDs in tables
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Format
          </label>
          <select
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>
    </div>
  );
}
