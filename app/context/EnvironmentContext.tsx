"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Environment {
  id: string;
  name: string;
  region: string;
  apiEndpoint?: string;
}

export const environments: Environment[] = [
  { 
    id: 'dev', 
    name: 'Development', 
    region: 'us-east-1',
    apiEndpoint: 'https://dev-api.example.com'
  },
  { 
    id: 'uat', 
    name: 'UAT', 
    region: 'us-east-1',
    apiEndpoint: 'https://uat-api.example.com'
  },
  { 
    id: 'prod', 
    name: 'Production', 
    region: 'us-west-2',
    apiEndpoint: 'https://prod-api.example.com'
  },
];

interface EnvironmentContextType {
  selectedEnv: string;
  setSelectedEnv: (envId: string) => void;
  currentEnv: Environment;
}

const EnvironmentContext = createContext<EnvironmentContextType | undefined>(undefined);

export function EnvironmentProvider({ children }: { children: ReactNode }) {
  const [selectedEnv, setSelectedEnv] = useState('dev');
  
  const currentEnv = environments.find(env => env.id === selectedEnv) || environments[0];

  return (
    <EnvironmentContext.Provider value={{ selectedEnv, setSelectedEnv, currentEnv }}>
      {children}
    </EnvironmentContext.Provider>
  );
}

export function useEnvironment() {
  const context = useContext(EnvironmentContext);
  if (context === undefined) {
    throw new Error('useEnvironment must be used within an EnvironmentProvider');
  }
  return context;
}
