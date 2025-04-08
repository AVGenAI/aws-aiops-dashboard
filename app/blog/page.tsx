"use client";

import { useState } from 'react';
import Link from 'next/link';
import Icon from '../components/Icon';

interface BlogPost {
  id: string;
  title: string;
  date: string;
  month: string;
  day: number;
  excerpt: string;
  category: string;
  link: string;
}

export default function BlogPage() {
  const [posts] = useState<BlogPost[]>([
    {
      id: 'serverless-icymi-q1',
      title: 'Serverless ICYMI Q1 2025',
      date: 'April 7, 2025',
      month: 'APR',
      day: 7,
      excerpt: 'A recap of serverless announcements, launches, and customer stories from Q1 2025.',
      category: 'Serverless',
      link: 'https://aws.amazon.com/blogs/compute/'
    },
    {
      id: 'intel-xeon-instances',
      title: 'How AWS and Intel make Xeon instances more accessible and cost-effective with DeepSpeed',
      date: 'April 7, 2025',
      month: 'APR',
      day: 7,
      excerpt: 'Learn how AWS and Intel are making high-performance computing more accessible and cost-effective.',
      category: 'Compute',
      link: 'https://aws.amazon.com/blogs/compute/'
    },
    {
      id: 'guidance-tools',
      title: 'New guidance and tools: Cloud-native media workflows on AWS',
      date: 'April 3, 2025',
      month: 'APR',
      day: 3,
      excerpt: 'Discover new guidance and tools for building cloud-native media workflows on AWS.',
      category: 'Media',
      link: 'https://aws.amazon.com/blogs/media/'
    },
    {
      id: 'multi-partner',
      title: 'New multi-partner live cloud production workflow supported by AWS',
      date: 'April 2, 2025',
      month: 'APR',
      day: 2,
      excerpt: 'Explore the new multi-partner live cloud production workflow supported by AWS.',
      category: 'Media',
      link: 'https://aws.amazon.com/blogs/media/'
    },
    {
      id: 'codebuilder',
      title: 'AWS CodeBuilder now supports enhanced debugging experience',
      date: 'March 28, 2025',
      month: 'MAR',
      day: 28,
      excerpt: 'Learn about the enhanced debugging experience now available in AWS CodeBuilder.',
      category: 'DevOps',
      link: 'https://aws.amazon.com/blogs/devops/'
    },
    {
      id: 'bedrock-announces',
      title: 'Amazon Bedrock announces general availability of general purpose caching',
      date: 'March 25, 2025',
      month: 'MAR',
      day: 25,
      excerpt: 'Amazon Bedrock now offers general availability of general purpose caching for improved performance.',
      category: 'AI/ML',
      link: 'https://aws.amazon.com/blogs/machine-learning/'
    }
  ]);

  const [categories] = useState([
    { id: 'all', name: 'All Categories' },
    { id: 'compute', name: 'Compute' },
    { id: 'serverless', name: 'Serverless' },
    { id: 'ai-ml', name: 'AI/ML' },
    { id: 'devops', name: 'DevOps' },
    { id: 'media', name: 'Media' }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(post => post.category.toLowerCase() === selectedCategory);

  return (
    <main className="p-8 bg-gray-50 min-h-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Recent AWS Blog Posts</h1>

      <div className="mb-6 bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === category.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map(post => (
          <div key={post.id} className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 p-4 flex items-center">
              <div className="flex flex-col items-center justify-center bg-blue-100 text-blue-700 rounded w-12 h-12 mr-3">
                <span className="text-xs font-medium">{post.month}</span>
                <span className="text-lg font-bold">{post.day}</span>
              </div>
              <h2 className="font-medium text-gray-800 line-clamp-2">{post.title}</h2>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">{post.category}</span>
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center"
                >
                  Read more
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-300 shadow-sm">
          <p className="text-gray-500">No blog posts found for this category.</p>
        </div>
      )}

      <div className="mt-6 text-center">
        <a
          href="https://aws.amazon.com/blogs/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          View all AWS blog posts
        </a>
      </div>
    </main>
  );
}
