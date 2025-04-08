"use client";

import { useState, useEffect } from 'react';

interface Automation {
  id: number;
  name: string;
  trigger: string;
  action: string;
}

interface AutomationModalProps {
  automation?: Automation;
  onSave: (automation: Omit<Automation, 'id'>) => void;
}

export default function AutomationModal({ automation, onSave }: AutomationModalProps) {
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState('');
  const [action, setAction] = useState('');

  // If editing an existing automation, populate the form
  useEffect(() => {
    if (automation) {
      setName(automation.name);
      setTrigger(automation.trigger);
      setAction(automation.action);
    }
  }, [automation]);

  const handleSubmit = () => {
    if (name && trigger && action) {
      onSave({ name, trigger, action });
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          {automation ? 'Edit automation rule' : 'Create a new automation rule'}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rule Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            placeholder="e.g., RestartWebServer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trigger
          </label>
          <select
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="">Select a trigger</option>
            <option value="CPU Alarm">CPU Alarm</option>
            <option value="Memory Alarm">Memory Alarm</option>
            <option value="Disk Space Alarm">Disk Space Alarm</option>
            <option value="RDS Connections">RDS Connections</option>
            <option value="Error Log Pattern">Error Log Pattern</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Action
          </label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="">Select an action</option>
            <option value="SSM Runbook">SSM Runbook</option>
            <option value="Lambda Function">Lambda Function</option>
            <option value="SNS Notification">SNS Notification</option>
            <option value="Auto Scaling">Auto Scaling</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!name || !trigger || !action}
        >
          {automation ? 'Update Rule' : 'Create Rule'}
        </button>
      </div>
    </div>
  );
}
