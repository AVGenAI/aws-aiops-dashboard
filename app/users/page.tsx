"use client";

import { useState } from 'react';
import Icon from '../components/Icon';

interface User {
  id: number;
  email: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, email: 'admin@example.com', role: 'Admin' },
    { id: 2, email: 'dev@example.com', role: 'Developer' },
  ]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Viewer');
  const [editingId, setEditingId] = useState<number | null>(null);

  function addUser() {
    if (!email) return;
    const newUser = { id: Date.now(), email, role };
    setUsers([...users, newUser]);
    setEmail('');
    setRole('Viewer');
  }

  function startEditing(user: User) {
    setEditingId(user.id);
    setEmail(user.email);
    setRole(user.role);
  }

  function saveEdit() {
    if (!editingId || !email) return;
    setUsers(users.map(user => 
      user.id === editingId ? { ...user, email, role } : user
    ));
    setEditingId(null);
    setEmail('');
    setRole('Viewer');
  }

  function cancelEdit() {
    setEditingId(null);
    setEmail('');
    setRole('Viewer');
  }

  function deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  }

  return (
    <main className="p-8 bg-gray-50 min-h-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">User Management</h1>

      <div className="mb-6 bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
        <div className="flex items-center mb-4">
          <Icon service="users" className="mr-2" />
          <h2 className="text-lg font-semibold text-gray-700">
            {editingId ? 'Edit User' : 'Add User'}
          </h2>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border border-gray-300 p-2 rounded flex-1 text-sm"
          />
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="border border-gray-300 p-2 rounded text-sm"
          >
            <option>Admin</option>
            <option>Developer</option>
            <option>Viewer</option>
          </select>
          {editingId ? (
            <div className="flex space-x-2">
              <button
                onClick={saveEdit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
              >
                Save Changes
              </button>
              <button
                onClick={cancelEdit}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={addUser}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              disabled={!email}
            >
              Add User
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
        <div className="flex items-center mb-4">
          <Icon service="users" className="mr-2" />
          <h2 className="text-lg font-semibold text-gray-700">Existing Users</h2>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Email</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Role</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3 text-sm text-gray-700">{user.email}</td>
                <td className="p-3 text-sm text-gray-700">{user.role}</td>
                <td className="p-3 text-sm space-x-2">
                  <button
                    onClick={() => startEditing(user)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
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
    </main>
  );
}
