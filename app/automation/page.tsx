"use client";

import { useState } from 'react';
import Modal from '../components/Modal';
import AutomationModal from '../components/automation/AutomationModal';
import Icon from '../components/Icon';

interface Automation {
  id: number;
  name: string;
  trigger: string;
  action: string;
}

export default function AutomationPage() {
  const [automations, setAutomations] = useState<Automation[]>([
    { id: 1, name: 'RestartWebServer', trigger: 'CPU Alarm', action: 'SSM Runbook' },
    { id: 2, name: 'ScaleDatabase', trigger: 'RDS Connections', action: 'Lambda Function' },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<Automation | undefined>(undefined);
  const [nextId, setNextId] = useState(3); // For generating new IDs

  return (
    <main className="p-8 bg-gray-50 min-h-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Automation & Remediation</h1>
      <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
        <div className="mb-4">
          <button 
            onClick={() => {
              setEditingAutomation(undefined);
              setModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm flex items-center"
          >
            <Icon service="automation" className="mr-2" />
            Create Automation Rule
          </button>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Trigger</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Action</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {automations.map(a => (
              <tr key={a.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3 text-sm text-gray-700">{a.name}</td>
                <td className="p-3 text-sm text-gray-700">{a.trigger}</td>
                <td className="p-3 text-sm text-gray-700">{a.action}</td>
                <td className="p-3 text-sm space-x-2">
                  <button 
                    onClick={() => {
                      setEditingAutomation(a);
                      setModalOpen(true);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete "${a.name}"?`)) {
                        setAutomations(automations.filter(automation => automation.id !== a.id));
                      }
                    }}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for creating/editing automation rules */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingAutomation ? "Edit Automation Rule" : "Create Automation Rule"}
      >
        <AutomationModal
          automation={editingAutomation}
          onSave={(newAutomation) => {
            if (editingAutomation) {
              // Update existing automation
              setAutomations(automations.map(a => 
                a.id === editingAutomation.id 
                  ? { ...newAutomation, id: editingAutomation.id } 
                  : a
              ));
            } else {
              // Add new automation
              setAutomations([...automations, { ...newAutomation, id: nextId }]);
              setNextId(nextId + 1);
            }
            setModalOpen(false);
          }}
        />
      </Modal>
    </main>
  );
}
