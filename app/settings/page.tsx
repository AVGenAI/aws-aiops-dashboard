"use client";

import { useState } from 'react';
import Modal from '../components/Modal';
import CredentialsModal from '../components/settings/CredentialsModal';
import NotificationsModal from '../components/settings/NotificationsModal';
import PreferencesModal from '../components/settings/PreferencesModal';
import Icon from '../components/Icon';

export default function SettingsPage() {
  const [openModal, setOpenModal] = useState<string | null>(null);

  const handleOpenModal = (modalName: string) => {
    setOpenModal(modalName);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
  };
  return (
    <main className="p-8 bg-gray-50 min-h-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Settings</h1>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
          <div className="flex items-center mb-4">
            <Icon service="iam" className="mr-2" />
            <h2 className="text-lg font-semibold text-gray-700">AWS Credentials</h2>
          </div>
          <p className="text-sm text-gray-600 mb-2">Configure AWS access keys or IAM roles.</p>
          <button 
            onClick={() => handleOpenModal('credentials')}
            className="text-sm text-blue-600 hover:underline"
          >
            Update Credentials
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
          <div className="flex items-center mb-4">
            <Icon service="cloudwatch" className="mr-2" />
            <h2 className="text-lg font-semibold text-gray-700">Notification Channels</h2>
          </div>
          <p className="text-sm text-gray-600 mb-2">Set up email, Slack, or other notification endpoints.</p>
          <button 
            onClick={() => handleOpenModal('notifications')}
            className="text-sm text-blue-600 hover:underline"
          >
            Configure Notifications
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
          <div className="flex items-center mb-4">
            <Icon service="settings" className="mr-2" />
            <h2 className="text-lg font-semibold text-gray-700">Application Preferences</h2>
          </div>
          <p className="text-sm text-gray-600 mb-2">Customize theme, default region, etc.</p>
          <button 
            onClick={() => handleOpenModal('preferences')}
            className="text-sm text-blue-600 hover:underline"
          >
            Change Preferences
          </button>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={openModal === 'credentials'}
        onClose={handleCloseModal}
        title="AWS Credentials"
      >
        <CredentialsModal />
      </Modal>

      <Modal
        isOpen={openModal === 'notifications'}
        onClose={handleCloseModal}
        title="Notification Channels"
      >
        <NotificationsModal />
      </Modal>

      <Modal
        isOpen={openModal === 'preferences'}
        onClose={handleCloseModal}
        title="Application Preferences"
      >
        <PreferencesModal />
      </Modal>
    </main>
  );
}
