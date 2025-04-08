"use client";

import { useState } from 'react';
import { useEnvironment } from '../../context/EnvironmentContext';

export default function CredentialsModal() {
  const { currentEnv } = useEnvironment();
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [useIamRole, setUseIamRole] = useState(false);
  const [roleName, setRoleName] = useState('');

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Configure AWS credentials for the <span className="font-semibold">{currentEnv.name}</span> environment.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="radio"
            id="access-keys"
            name="credential-type"
            checked={!useIamRole}
            onChange={() => setUseIamRole(false)}
            className="mr-2"
          />
          <label htmlFor="access-keys" className="text-sm font-medium">Use Access Keys</label>
        </div>

        {!useIamRole && (
          <div className="ml-6 space-y-4">
            <div>
              <label htmlFor="access-key" className="block text-sm font-medium text-gray-700 mb-1">
                Access Key ID
              </label>
              <input
                type="text"
                id="access-key"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                placeholder="AKIAIOSFODNN7EXAMPLE"
              />
            </div>
            <div>
              <label htmlFor="secret-key" className="block text-sm font-medium text-gray-700 mb-1">
                Secret Access Key
              </label>
              <input
                type="password"
                id="secret-key"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
              />
            </div>
          </div>
        )}

        <div className="flex items-center">
          <input
            type="radio"
            id="iam-role"
            name="credential-type"
            checked={useIamRole}
            onChange={() => setUseIamRole(true)}
            className="mr-2"
          />
          <label htmlFor="iam-role" className="text-sm font-medium">Use IAM Role</label>
        </div>

        {useIamRole && (
          <div className="ml-6">
            <label htmlFor="role-name" className="block text-sm font-medium text-gray-700 mb-1">
              IAM Role Name
            </label>
            <input
              type="text"
              id="role-name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              placeholder="AIOpsServiceRole"
            />
          </div>
        )}
      </div>

      <div className="bg-blue-50 p-4 rounded text-sm text-blue-700 border border-blue-200">
        <p className="font-medium mb-1">Security Note:</p>
        <p>Your credentials are stored securely and are only used to make AWS API calls on your behalf.</p>
      </div>
    </div>
  );
}
