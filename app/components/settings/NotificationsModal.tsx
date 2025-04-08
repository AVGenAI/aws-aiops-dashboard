"use client";

import { useState } from 'react';

interface NotificationChannel {
  id: string;
  type: 'email' | 'slack' | 'webhook';
  name: string;
  config: any;
  enabled: boolean;
}

export default function NotificationsModal() {
  const [channels, setChannels] = useState<NotificationChannel[]>([
    {
      id: '1',
      type: 'email',
      name: 'Admin Email',
      config: { email: 'admin@example.com' },
      enabled: true
    }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newChannelType, setNewChannelType] = useState<'email' | 'slack' | 'webhook'>('email');
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelConfig, setNewChannelConfig] = useState({ email: '', webhook: '', slackWebhook: '' });

  const handleAddChannel = () => {
    const newChannel: NotificationChannel = {
      id: Date.now().toString(),
      type: newChannelType,
      name: newChannelName,
      config: {
        email: newChannelType === 'email' ? newChannelConfig.email : undefined,
        webhook: newChannelType === 'webhook' ? newChannelConfig.webhook : undefined,
        slackWebhook: newChannelType === 'slack' ? newChannelConfig.slackWebhook : undefined,
      },
      enabled: true
    };

    setChannels([...channels, newChannel]);
    setShowAddForm(false);
    setNewChannelName('');
    setNewChannelConfig({ email: '', webhook: '', slackWebhook: '' });
  };

  const toggleChannel = (id: string) => {
    setChannels(channels.map(channel => 
      channel.id === id ? { ...channel, enabled: !channel.enabled } : channel
    ));
  };

  const deleteChannel = (id: string) => {
    setChannels(channels.filter(channel => channel.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Configure notification channels for alerts and updates.
        </p>
      </div>

      {/* Existing Channels */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Notification Channels</h3>
        
        {channels.length === 0 ? (
          <p className="text-sm text-gray-500">No notification channels configured.</p>
        ) : (
          <div className="border border-gray-200 rounded overflow-hidden">
            {channels.map(channel => (
              <div key={channel.id} className="flex items-center justify-between p-3 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={channel.enabled}
                    onChange={() => toggleChannel(channel.id)}
                    className="mr-3"
                  />
                  <div>
                    <p className="text-sm font-medium">{channel.name}</p>
                    <p className="text-xs text-gray-500">
                      {channel.type === 'email' && `Email: ${channel.config.email}`}
                      {channel.type === 'slack' && 'Slack Webhook'}
                      {channel.type === 'webhook' && 'Custom Webhook'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => deleteChannel(channel.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Channel Form */}
      {showAddForm ? (
        <div className="border border-gray-200 rounded p-4 space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Add Notification Channel</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Channel Type
            </label>
            <select
              value={newChannelType}
              onChange={(e) => setNewChannelType(e.target.value as any)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="email">Email</option>
              <option value="slack">Slack</option>
              <option value="webhook">Webhook</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Channel Name
            </label>
            <input
              type="text"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              placeholder="e.g., Team Email"
            />
          </div>
          
          {newChannelType === 'email' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={newChannelConfig.email}
                onChange={(e) => setNewChannelConfig({...newChannelConfig, email: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                placeholder="team@example.com"
              />
            </div>
          )}
          
          {newChannelType === 'slack' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slack Webhook URL
              </label>
              <input
                type="text"
                value={newChannelConfig.slackWebhook}
                onChange={(e) => setNewChannelConfig({...newChannelConfig, slackWebhook: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                placeholder="https://hooks.slack.com/services/..."
              />
            </div>
          )}
          
          {newChannelType === 'webhook' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook URL
              </label>
              <input
                type="text"
                value={newChannelConfig.webhook}
                onChange={(e) => setNewChannelConfig({...newChannelConfig, webhook: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                placeholder="https://api.example.com/webhook"
              />
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddChannel}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              disabled={!newChannelName || (newChannelType === 'email' && !newChannelConfig.email) || (newChannelType === 'slack' && !newChannelConfig.slackWebhook) || (newChannelType === 'webhook' && !newChannelConfig.webhook)}
            >
              Add Channel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          Add Notification Channel
        </button>
      )}
    </div>
  );
}
