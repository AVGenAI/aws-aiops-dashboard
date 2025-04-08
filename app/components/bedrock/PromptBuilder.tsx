'use client';

import { useState, useEffect } from 'react';
import { useEnvironment } from '../../context/EnvironmentContext';

interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: string[];
  modelId: string;
  createdAt: string;
  updatedAt: string;
  effectiveness: number;
  usageCount: number;
}

interface PromptBuilderProps {
  selectedModel: string;
  onPromptSubmit: (prompt: string, variables: Record<string, string>) => Promise<void>;
  className?: string;
}

const PromptBuilder = ({
  selectedModel,
  onPromptSubmit,
  className = ''
}: PromptBuilderProps) => {
  const { currentEnv } = useEnvironment();
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('custom');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [promptHistory, setPromptHistory] = useState<{prompt: string, variables: Record<string, string>, timestamp: string}[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Fetch prompt templates
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/bedrock/prompt-templates?environment=${currentEnv.id}&modelId=${selectedModel}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setTemplates(data.templates || []);
      } catch (e: any) {
        console.error('Error fetching prompt templates:', e);
        setError(e.message || 'Failed to fetch prompt templates');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTemplates();
  }, [currentEnv.id, selectedModel]);

  // Fetch prompt history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/bedrock/prompt-history?environment=${currentEnv.id}&modelId=${selectedModel}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setPromptHistory(data.history || []);
      } catch (e: any) {
        console.error('Error fetching prompt history:', e);
        // Don't set error state for history as it's not critical
      }
    };
    
    fetchHistory();
  }, [currentEnv.id, selectedModel]);

  // Update variables when template changes
  useEffect(() => {
    if (selectedTemplate === 'custom') {
      setVariables({});
      return;
    }
    
    const template = templates.find(t => t.id === selectedTemplate);
    if (!template) return;
    
    // Initialize variables with empty strings
    const newVariables: Record<string, string> = {};
    template.variables.forEach(variable => {
      newVariables[variable] = '';
    });
    
    setVariables(newVariables);
  }, [selectedTemplate, templates]);

  // Get the current prompt template
  const getCurrentTemplate = () => {
    if (selectedTemplate === 'custom') return null;
    return templates.find(t => t.id === selectedTemplate);
  };

  // Generate the final prompt with variables replaced
  const generateFinalPrompt = () => {
    if (selectedTemplate === 'custom') return customPrompt;
    
    const template = getCurrentTemplate();
    if (!template) return '';
    
    let finalPrompt = template.template;
    
    // Replace variables in the template
    Object.entries(variables).forEach(([key, value]) => {
      finalPrompt = finalPrompt.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    });
    
    return finalPrompt;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalPrompt = generateFinalPrompt();
    if (!finalPrompt.trim()) {
      setError('Prompt cannot be empty');
      return;
    }
    
    try {
      await onPromptSubmit(finalPrompt, variables);
      
      // Add to history
      setPromptHistory(prev => [
        {
          prompt: finalPrompt,
          variables: { ...variables },
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
    } catch (e: any) {
      setError(e.message || 'Failed to submit prompt');
    }
  };

  // Load a prompt from history
  const loadFromHistory = (index: number) => {
    const historyItem = promptHistory[index];
    
    if (historyItem) {
      // Check if it matches a template
      const matchingTemplate = templates.find(template => {
        // Check if the prompt matches the template with variables replaced
        let templatePrompt = template.template;
        const historyVariables = historyItem.variables;
        
        // Replace variables in the template
        Object.entries(historyVariables).forEach(([key, value]) => {
          templatePrompt = templatePrompt.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
        });
        
        return templatePrompt === historyItem.prompt;
      });
      
      if (matchingTemplate) {
        setSelectedTemplate(matchingTemplate.id);
        setVariables(historyItem.variables);
      } else {
        setSelectedTemplate('custom');
        setCustomPrompt(historyItem.prompt);
      }
      
      setShowHistory(false);
    }
  };

  return (
    <div className={`${className}`}>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium text-gray-700">Prompt Builder</h3>
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showHistory ? 'Hide History' : 'Show History'}
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error}
          </div>
        )}
        
        {showHistory && (
          <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h4 className="text-sm font-medium text-gray-700">Prompt History</h4>
            </div>
            <div className="max-h-60 overflow-y-auto p-2">
              {promptHistory.length === 0 ? (
                <p className="text-sm text-gray-500 p-2">No history available</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {promptHistory.map((item, index) => (
                    <li key={index} className="py-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.prompt.length > 50 ? `${item.prompt.substring(0, 50)}...` : item.prompt}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(item.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => loadFromHistory(index)}
                          className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          Load
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="promptTemplate" className="block text-sm font-medium text-gray-700 mb-1">
              Prompt Template
            </label>
            <select
              id="promptTemplate"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
              disabled={loading}
            >
              <option value="custom">Custom Prompt</option>
              {templates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name} {template.effectiveness > 0 ? `(${template.effectiveness.toFixed(1)}⭐)` : ''}
                </option>
              ))}
            </select>
          </div>
          
          {selectedTemplate === 'custom' ? (
            <div className="mb-4">
              <label htmlFor="customPrompt" className="block text-sm font-medium text-gray-700 mb-1">
                Custom Prompt
              </label>
              <textarea
                id="customPrompt"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={5}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your prompt here..."
              />
            </div>
          ) : (
            <>
              {getCurrentTemplate() && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Template Description
                    </label>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 mr-2">Effectiveness:</span>
                      <span className="text-xs font-medium">
                        {getCurrentTemplate()?.effectiveness.toFixed(1)}⭐
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {getCurrentTemplate()?.description}
                  </p>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm text-gray-700">
                    {getCurrentTemplate()?.template}
                  </div>
                </div>
              )}
              
              {Object.keys(variables).length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Template Variables</h4>
                  <div className="space-y-3">
                    {Object.entries(variables).map(([key, value]) => (
                      <div key={key}>
                        <label htmlFor={`var-${key}`} className="block text-sm text-gray-700 mb-1">
                          {key}
                        </label>
                        <input
                          id={`var-${key}`}
                          type="text"
                          value={value}
                          onChange={(e) => setVariables(prev => ({ ...prev, [key]: e.target.value }))}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder={`Enter value for ${key}...`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
            <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm text-gray-700 whitespace-pre-wrap">
              {generateFinalPrompt() || <span className="text-gray-400">Preview will appear here...</span>}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'Submitting...' : 'Submit Prompt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromptBuilder;
