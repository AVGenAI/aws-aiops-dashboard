"use client";

import { useState } from 'react';
import Link from 'next/link';
import Icon from '../components/Icon';

interface GuideCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
  isExternal?: boolean;
}

export default function ExplorePage() {
  const [guides] = useState<GuideCard[]>([
    {
      id: 'llm',
      title: 'Deploy LLMs with confidence',
      description: 'Transform your business with the right LLM and price-performant, purpose-built infrastructure.',
      icon: 'lambda',
      link: 'https://aws.amazon.com/generative-ai/',
      isExternal: true
    },
    {
      id: 'lightning',
      title: 'Lightning-fast coding experience with Amazon Q',
      description: 'The Q Developer CLI agent can execute files locally, call AWS APIs, run bash commands, and more.',
      icon: 'cloudformation',
      link: 'https://aws.amazon.com/q/',
      isExternal: true
    },
    {
      id: 'training',
      title: 'AI training, curated by AWS',
      description: 'Learn the fundamental concepts of AI through interactive labs, video tutorials, and hands-on exercises.',
      icon: 'cloudwatch',
      link: 'https://aws.amazon.com/training/learn-about/generative-ai/',
      isExternal: true
    },
    {
      id: 'business',
      title: 'AWS Business Support limited time offer',
      description: 'Start your trial now with a hassle-free credit refund.',
      icon: 'cost',
      link: 'https://aws.amazon.com/premiumsupport/plans/business/',
      isExternal: true
    },
    {
      id: 'serverless',
      title: 'Build serverless applications',
      description: 'Deploy applications without managing servers using AWS Lambda and other serverless services.',
      icon: 'lambda',
      link: 'https://aws.amazon.com/serverless/',
      isExternal: true
    },
    {
      id: 'containers',
      title: 'Modernize with containers',
      description: 'Run containerized applications on AWS using ECS, EKS, or Fargate.',
      icon: 'eks',
      link: 'https://aws.amazon.com/containers/',
      isExternal: true
    }
  ]);

  return (
    <main className="p-8 bg-gray-50 min-h-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Explore AWS</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map(guide => (
          <div key={guide.id} className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
            <div className="flex items-center mb-3">
              <Icon service={guide.icon} className="mr-2" />
              <h2 className="font-semibold text-gray-700">{guide.title}</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">{guide.description}</p>
            {guide.isExternal ? (
              <a 
                href={guide.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-blue-600 hover:underline flex items-center"
              >
                Learn more
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : (
              <Link href={guide.link} className="text-sm text-blue-600 hover:underline">
                Learn more
              </Link>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
