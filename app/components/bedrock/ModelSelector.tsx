'use client';

import { useState, useEffect } from 'react';
import { useEnvironment } from '../../context/EnvironmentContext';

interface ModelProvider {
  name: string;
  models: {
    id: string;
    displayName: string;
    capabilities: string[];
    contextLength: number;
    costPerMillionTokens: {
      input: number;
      output: number;
    };
    recommended: boolean;
  }[];
}

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  showDetails?: boolean;
  className?: string;
}

const ModelSelector = ({
  selectedModel,
  onModelChange,
  showDetails = false,
  className = ''
}: ModelSelectorProps) => {
  const { currentEnv } = useEnvironment();
  const [providers, setProviders] = useState<ModelProvider[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedModel, setExpandedModel] = useState<string | null>(null);
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [inputTokens, setInputTokens] = useState<number>(1000);
  const [outputTokens, setOutputTokens] = useState<number>(500);

  // Fetch available Bedrock models
  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/bedrock/models?environment=${currentEnv.id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setProviders(data.providers || []);
        
        // If the selected model is not in the list, select the first available model
        if (data.providers && data.providers.length > 0) {
          const allModels = data.providers.flatMap((p: ModelProvider) => p.models);
          const modelExists = allModels.some((m: {id: string}) => m.id === selectedModel);
          
          if (!modelExists && allModels.length > 0) {
            onModelChange(allModels[0].id);
          }
        }
      } catch (e: any) {
        console.error('Error fetching Bedrock models:', e);
        setError(e.message || 'Failed to fetch Bedrock models');
      } finally {
        setLoading(false);
      }
    };
    
    fetchModels();
  }, [currentEnv.id, selectedModel, onModelChange]);

  // Calculate estimated cost when input/output tokens or selected model changes
  useEffect(() => {
    if (!providers.length) return;
    
    const allModels = providers.flatMap(p => p.models);
    const model = allModels.find(m => m.id === selectedModel);
    
    if (model) {
      const cost = (inputTokens / 1000000) * model.costPerMillionTokens.input + 
                  (outputTokens / 1000000) * model.costPerMillionTokens.output;
      setEstimatedCost(cost);
    }
  }, [selectedModel, inputTokens, outputTokens, providers]);

  // Get the selected model details
  const getSelectedModelDetails = () => {
    if (!providers.length) return null;
    
    const allModels = providers.flatMap(p => p.models);
    return allModels.find(m => m.id === selectedModel);
  };

  // Get the provider name for a model
  const getProviderName = (modelId: string) => {
    const provider = providers.find(p => 
      p.models.some(m => m.id === modelId)
    );
    return provider ? provider.name : modelId.split('.')[0];
  };

  return (
    <div className={`${className}`}>
      <div className="mb-4">
        <label htmlFor="bedrockModel" className="block text-sm font-medium text-gray-700 mb-1">
          Amazon Bedrock Model
        </label>
        <div className="relative">
          {loading && (
            <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-blue-600 rounded-full"></div>
            </div>
          )}
          <select
            id="bedrockModel"
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
            disabled={loading}
          >
            {providers.length > 0 ? (
              // Render dynamically fetched models
              providers.map((provider) => (
                <optgroup key={provider.name} label={`${provider.name} Models`}>
                  {provider.models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.displayName} {model.recommended ? '(Recommended)' : ''}
                    </option>
                  ))}
                </optgroup>
              ))
            ) : (
              // Fallback to hardcoded models if API fails
              <>
                {/* Anthropic Claude Models */}
                <optgroup label="Anthropic Claude Models">
                  <option value="anthropic.claude-v2">Claude V2</option>
                  <option value="anthropic.claude-v2:1">Claude V2:1</option>
                  <option value="anthropic.claude-instant-v1">Claude Instant V1</option>
                  <option value="anthropic.claude-3-sonnet-20240229-v1:0">Claude 3 Sonnet</option>
                  <option value="anthropic.claude-3-haiku-20240307-v1:0">Claude 3 Haiku</option>
                  <option value="anthropic.claude-3-opus-20240229-v1:0">Claude 3 Opus</option>
                </optgroup>
                
                {/* Amazon Titan Models */}
                <optgroup label="Amazon Titan Models">
                  <option value="amazon.titan-text-express-v1">Titan Text Express</option>
                  <option value="amazon.titan-text-lite-v1">Titan Text Lite</option>
                  <option value="amazon.titan-embed-text-v1">Titan Embed Text</option>
                  <option value="amazon.titan-embed-image-v1">Titan Embed Image</option>
                  <option value="amazon.titan-image-generator-v1">Titan Image Generator</option>
                </optgroup>
                
                {/* AI21 Labs Models */}
                <optgroup label="AI21 Labs Models">
                  <option value="ai21.j2-mid-v1">Jurassic-2 Mid</option>
                  <option value="ai21.j2-ultra-v1">Jurassic-2 Ultra</option>
                  <option value="ai21.jamba-instruct-v1">Jamba Instruct</option>
                </optgroup>
                
                {/* Cohere Models */}
                <optgroup label="Cohere Models">
                  <option value="cohere.command-text-v14">Command Text</option>
                  <option value="cohere.command-light-text-v14">Command Light Text</option>
                  <option value="cohere.embed-english-v3">Embed English</option>
                  <option value="cohere.embed-multilingual-v3">Embed Multilingual</option>
                </optgroup>
                
                {/* Meta Models */}
                <optgroup label="Meta Models">
                  <option value="meta.llama2-13b-chat-v1">Llama 2 13B Chat</option>
                  <option value="meta.llama2-70b-chat-v1">Llama 2 70B Chat</option>
                  <option value="meta.llama3-8b-instruct-v1:0">Llama 3 8B Instruct</option>
                  <option value="meta.llama3-70b-instruct-v1:0">Llama 3 70B Instruct</option>
                </optgroup>
                
                {/* Stability AI Models */}
                <optgroup label="Stability AI Models">
                  <option value="stability.stable-diffusion-xl-v1">Stable Diffusion XL</option>
                  <option value="stability.stable-image-core-v1:0">Stable Image Core</option>
                  <option value="stability.stable-image-ultra-v1:0">Stable Image Ultra</option>
                </optgroup>
              </>
            )}
          </select>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {error}
        </div>
      )}
      
      {showDetails && (
        <div className="mt-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Model Details</h4>
            
            {loading ? (
              <div className="flex items-center justify-center h-20">
                <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-blue-600 rounded-full"></div>
              </div>
            ) : getSelectedModelDetails() ? (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Provider</p>
                    <p className="text-sm font-medium">{getProviderName(selectedModel)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Context Length</p>
                    <p className="text-sm font-medium">{getSelectedModelDetails()?.contextLength.toLocaleString()} tokens</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Capabilities</p>
                  <div className="flex flex-wrap gap-2">
                    {getSelectedModelDetails()?.capabilities.map(capability => (
                      <span 
                        key={capability}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Cost Estimation</p>
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div>
                      <label htmlFor="inputTokens" className="block text-xs text-gray-500">
                        Input Tokens
                      </label>
                      <input
                        id="inputTokens"
                        type="number"
                        min="0"
                        value={inputTokens}
                        onChange={(e) => setInputTokens(parseInt(e.target.value) || 0)}
                        className="mt-1 block w-full px-3 py-1 text-sm border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="outputTokens" className="block text-xs text-gray-500">
                        Output Tokens
                      </label>
                      <input
                        id="outputTokens"
                        type="number"
                        min="0"
                        value={outputTokens}
                        onChange={(e) => setOutputTokens(parseInt(e.target.value) || 0)}
                        className="mt-1 block w-full px-3 py-1 text-sm border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Estimated Cost:</span>
                      <span className="text-sm font-medium">
                        ${estimatedCost !== null ? estimatedCost.toFixed(4) : '0.0000'}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      <div className="flex justify-between">
                        <span>Input: ${((inputTokens / 1000000) * (getSelectedModelDetails()?.costPerMillionTokens.input || 0)).toFixed(4)}</span>
                        <span>${(getSelectedModelDetails()?.costPerMillionTokens.input || 0).toFixed(2)}/million tokens</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Output: ${((outputTokens / 1000000) * (getSelectedModelDetails()?.costPerMillionTokens.output || 0)).toFixed(4)}</span>
                        <span>${(getSelectedModelDetails()?.costPerMillionTokens.output || 0).toFixed(2)}/million tokens</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">No model details available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
