"use client";

import { useState, useEffect } from 'react';
import { useEnvironment, environments } from '../context/EnvironmentContext';

export default function EnvironmentSelector() {
  const { selectedEnv, setSelectedEnv, currentEnv } = useEnvironment();
  const [isOpen, setIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  const handleSelect = (envId: string) => {
    if (envId !== selectedEnv) {
      setSelectedEnv(envId);
      setIsChanging(true);
    }
    setIsOpen(false);
  };

  // Show a visual indicator when environment changes
  useEffect(() => {
    if (isChanging) {
      const timer = setTimeout(() => {
        setIsChanging(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isChanging]);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1 text-sm px-3 py-1 rounded border transition-colors duration-300 ${
          isChanging 
            ? 'bg-blue-100 text-blue-700 border-blue-300' 
            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
        }`}
      >
        <span>{currentEnv.name}</span>
        <span className="text-xs text-gray-500">({currentEnv.region})</span>
        <span className="ml-1">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10 w-64">
          <div className="p-2 border-b border-gray-200 bg-gray-50">
            <h3 className="text-xs font-semibold text-gray-700">Select Environment</h3>
          </div>
          <div className="p-2">
            {environments.map(env => (
              <div key={env.id} className="flex items-center py-1">
                <input
                  type="radio"
                  id={`env-${env.id}`}
                  name="environment"
                  checked={selectedEnv === env.id}
                  onChange={() => handleSelect(env.id)}
                  className="mr-2"
                />
                <label htmlFor={`env-${env.id}`} className="flex flex-col cursor-pointer">
                  <span className="text-sm">{env.name}</span>
                  <span className="text-xs text-gray-500">{env.region}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
