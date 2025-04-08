"use client";

import { useState, useEffect } from 'react';
import { useEnvironment } from '../context/EnvironmentContext';
import ModelSelector from '../components/bedrock/ModelSelector';
import PromptBuilder from '../components/bedrock/PromptBuilder';

export default function BedrockStudioPage() {
  const { currentEnv } = useEnvironment();
  const [selectedModel, setSelectedModel] = useState<string>('anthropic.claude-3-sonnet-20240229-v1:0');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [responseMetadata, setResponseMetadata] = useState<any | null>(null);
  const [showModelDetails, setShowModelDetails] = useState<boolean>(true);
  
  // Handle prompt submission
  const handlePromptSubmit = async (prompt: string, variables: Record<string, string>) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setResponseMetadata(null);
    
    try {
      const response = await fetch('/api/bedrock/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          modelId: selectedModel,
          environment: currentEnv.id,
          variables
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setResponse(data.completion);
      setResponseMetadata({
        modelId: data.modelId,
        usage: data.usage,
        finishReason: data.finishReason,
        timestamp: new Date().toISOString()
      });
      
      // Save to history (this would typically be handled by the API)
      // Here we're just logging it
      console.log('Prompt submitted:', {
        prompt,
        modelId: selectedModel,
        environment: currentEnv.id,
        timestamp: new Date().toISOString()
      });
    } catch (e: any) {
      console.error('Error submitting prompt:', e);
      setError(e.message || 'Failed to submit prompt');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <main className="p-8 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bedrock Studio</h1>
        <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm border border-purple-200">
          Environment: {currentEnv.name} ({currentEnv.region})
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Model Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800">Model Selection</h2>
              <button
                onClick={() => setShowModelDetails(!showModelDetails)}
                className="text-sm text-purple-600 hover:text-purple-800"
              >
                {showModelDetails ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
            
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              showDetails={showModelDetails}
            />
          </div>
        </div>
        
        {/* Middle and Right Columns - Prompt Builder and Response */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Prompt Engineering</h2>
            
            <PromptBuilder
              selectedModel={selectedModel}
              onPromptSubmit={handlePromptSubmit}
            />
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Response</h2>
            
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600 mb-2"></div>
                  <p className="text-gray-600">Generating response...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-lg">
                <p className="font-medium">Error generating response</p>
                <p className="text-sm">{error}</p>
              </div>
            ) : response ? (
              <div>
                <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4 whitespace-pre-wrap">
                  {response}
                </div>
                
                {responseMetadata && (
                  <div className="text-xs text-gray-500">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p><span className="font-medium">Model:</span> {responseMetadata.modelId}</p>
                        <p><span className="font-medium">Timestamp:</span> {new Date(responseMetadata.timestamp).toLocaleString()}</p>
                      </div>
                      <div>
                        <p><span className="font-medium">Prompt Tokens:</span> {responseMetadata.usage.promptTokens}</p>
                        <p><span className="font-medium">Completion Tokens:</span> {responseMetadata.usage.completionTokens}</p>
                        <p><span className="font-medium">Total Tokens:</span> {responseMetadata.usage.totalTokens}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p className="text-gray-500">Submit a prompt to see the response here.</p>
                <p className="text-sm text-gray-400 mt-1">Use the prompt builder to create effective prompts.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Information Box */}
      <div className="mt-8 p-4 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-700">
        <div className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-medium">
              Amazon Bedrock Studio
            </p>
            <p className="mt-1">
              This interface allows you to interact with Amazon Bedrock models, create and use prompt templates, 
              and analyze model performance. Use the prompt builder to create effective prompts with variables 
              and see how different models respond to the same prompt.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <a 
                href="https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs underline hover:text-purple-800"
              >
                Bedrock Documentation
              </a>
              <a 
                href="https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-engineering.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs underline hover:text-purple-800"
              >
                Prompt Engineering Guide
              </a>
              <a 
                href="https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs underline hover:text-purple-800"
              >
                Supported Models
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
