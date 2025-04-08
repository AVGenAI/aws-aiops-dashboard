"use client";

import { useState } from 'react';
import Link from 'next/link';
import Icon from '../components/Icon';
import { useEnvironment } from '../context/EnvironmentContext';

interface Solution {
  id: string;
  title: string;
  description: string;
  category: 'ai' | 'security' | 'infrastructure' | 'data' | 'devops';
  timeToComplete: string;
  link: string;
  isExternal?: boolean;
}

export default function SolutionsPage() {
  const { currentEnv } = useEnvironment();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [solutions] = useState<Solution[]>([
    {
      id: 'gen-ai',
      title: 'Launch generative AI applications with minimal coding',
      description: 'Deploy generative AI applications quickly using AWS services.',
      category: 'ai',
      timeToComplete: '15 mins',
      link: 'https://aws.amazon.com/generative-ai/',
      isExternal: true
    },
    {
      id: 'detect-errors',
      title: 'Detect and remediate coding errors',
      description: 'Use AWS tools to identify and fix coding errors in your applications.',
      category: 'devops',
      timeToComplete: '15 mins',
      link: 'https://aws.amazon.com/codewhisperer/',
      isExternal: true
    },
    {
      id: 'conversational-ai',
      title: 'Deploy conversational AI-powered business applications',
      description: 'Build and deploy conversational AI applications for your business.',
      category: 'ai',
      timeToComplete: '35 mins',
      link: 'https://aws.amazon.com/bedrock/',
      isExternal: true
    },
    {
      id: 'ml-models',
      title: 'Build machine learning models from development to production',
      description: 'Create, train, and deploy machine learning models on AWS.',
      category: 'ai',
      timeToComplete: '3 mins',
      link: 'https://aws.amazon.com/sagemaker/',
      isExternal: true
    },
    {
      id: 'security-assessment',
      title: 'Perform security assessment of your AWS environment',
      description: 'Identify security vulnerabilities and implement best practices.',
      category: 'security',
      timeToComplete: '20 mins',
      link: 'https://aws.amazon.com/security-hub/',
      isExternal: true
    },
    {
      id: 'data-lake',
      title: 'Build a data lake on AWS',
      description: 'Create a scalable data lake for your analytics workloads.',
      category: 'data',
      timeToComplete: '45 mins',
      link: 'https://aws.amazon.com/solutions/implementations/data-lake-solution/',
      isExternal: true
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Solutions', count: solutions.length },
    { id: 'ai', name: 'Artificial Intelligence', count: solutions.filter(s => s.category === 'ai').length },
    { id: 'security', name: 'Security', count: solutions.filter(s => s.category === 'security').length },
    { id: 'infrastructure', name: 'Infrastructure', count: solutions.filter(s => s.category === 'infrastructure').length },
    { id: 'data', name: 'Data & Analytics', count: solutions.filter(s => s.category === 'data').length },
    { id: 'devops', name: 'DevOps', count: solutions.filter(s => s.category === 'devops').length }
  ];

  const filteredSolutions = activeCategory === 'all' 
    ? solutions 
    : solutions.filter(solution => solution.category === activeCategory);

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'ai': return 'lambda';
      case 'security': return 'security';
      case 'infrastructure': return 'ec2';
      case 'data': return 'rds';
      case 'devops': return 'cloudformation';
      default: return 'dashboard';
    }
  };

  return (
    <main className="p-8 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Solutions</h1>
        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200">
          Viewing Solutions from AWS for {currentEnv.name}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Categories Sidebar */}
        <div className="w-full md:w-64 bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-3">Categories</h2>
          <ul className="space-y-2">
            {categories.map(category => (
              <li key={category.id}>
                <button
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm flex justify-between items-center ${
                    activeCategory === category.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <span>{category.name}</span>
                  <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                    {category.count}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Solutions List */}
        <div className="flex-1">
          <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
            <h2 className="font-semibold text-gray-700 mb-4">
              {activeCategory === 'all' ? 'All Solutions' : categories.find(c => c.id === activeCategory)?.name}
            </h2>
            
            <div className="space-y-4">
              {filteredSolutions.map(solution => (
                <div key={solution.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <Icon service={getCategoryIcon(solution.category)} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 mb-1">{solution.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{solution.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Time to complete: {solution.timeToComplete}</span>
                        {solution.isExternal ? (
                          <a 
                            href={solution.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sm text-blue-600 hover:underline flex items-center"
                          >
                            View Solution
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ) : (
                          <Link href={solution.link} className="text-sm text-blue-600 hover:underline">
                            View Solution
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredSolutions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No solutions found for this category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
