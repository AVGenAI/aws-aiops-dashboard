import { NextRequest, NextResponse } from 'next/server';
import { BedrockClient, ListFoundationModelsCommand } from '@aws-sdk/client-bedrock';

// Interface for model provider info
interface ModelProvider {
  name: string;
  models: {
    id: string;
    displayName: string;
  }[];
}

// Cache the models to avoid frequent API calls
let cachedModels: ModelProvider[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 3600000; // 1 hour in milliseconds

export async function GET(request: NextRequest) {
  try {
    // Check if we have cached models that are still valid
    const now = Date.now();
    if (cachedModels && now - lastFetchTime < CACHE_TTL) {
      return NextResponse.json({ providers: cachedModels });
    }

    // In a real implementation, we would use AWS credentials from environment variables
    // For now, we'll return mock data that mimics the AWS Bedrock API response
    
    // Uncomment this code when you have AWS credentials configured
    /*
    const client = new BedrockClient({
      region: 'us-east-1', // or get from environment variable
    });
    
    const command = new ListFoundationModelsCommand({});
    const response = await client.send(command);
    
    // Group models by provider
    const providers: ModelProvider[] = [];
    const providerMap = new Map<string, ModelProvider>();
    
    response.modelSummaries?.forEach(model => {
      const providerName = model.providerName || 'Unknown';
      
      if (!providerMap.has(providerName)) {
        const provider: ModelProvider = {
          name: providerName,
          models: []
        };
        providerMap.set(providerName, provider);
        providers.push(provider);
      }
      
      providerMap.get(providerName)?.models.push({
        id: model.modelId || '',
        displayName: model.modelName || model.modelId || ''
      });
    });
    
    // Update cache
    cachedModels = providers;
    lastFetchTime = now;
    
    return NextResponse.json({ providers });
    */
    
    // Mock data that mimics the AWS Bedrock API response
    const mockProviders: ModelProvider[] = [
      {
        name: 'Anthropic',
        models: [
          { id: 'anthropic.claude-v2', displayName: 'Claude V2' },
          { id: 'anthropic.claude-v2:1', displayName: 'Claude V2:1' },
          { id: 'anthropic.claude-instant-v1', displayName: 'Claude Instant V1' },
          { id: 'anthropic.claude-3-sonnet-20240229-v1:0', displayName: 'Claude 3 Sonnet' },
          { id: 'anthropic.claude-3-haiku-20240307-v1:0', displayName: 'Claude 3 Haiku' },
          { id: 'anthropic.claude-3-opus-20240229-v1:0', displayName: 'Claude 3 Opus' }
        ]
      },
      {
        name: 'Amazon',
        models: [
          { id: 'amazon.titan-text-express-v1', displayName: 'Titan Text Express' },
          { id: 'amazon.titan-text-lite-v1', displayName: 'Titan Text Lite' },
          { id: 'amazon.titan-embed-text-v1', displayName: 'Titan Embed Text' },
          { id: 'amazon.titan-embed-image-v1', displayName: 'Titan Embed Image' },
          { id: 'amazon.titan-image-generator-v1', displayName: 'Titan Image Generator' }
        ]
      },
      {
        name: 'AI21 Labs',
        models: [
          { id: 'ai21.j2-mid-v1', displayName: 'Jurassic-2 Mid' },
          { id: 'ai21.j2-ultra-v1', displayName: 'Jurassic-2 Ultra' },
          { id: 'ai21.jamba-instruct-v1', displayName: 'Jamba Instruct' }
        ]
      },
      {
        name: 'Cohere',
        models: [
          { id: 'cohere.command-text-v14', displayName: 'Command Text' },
          { id: 'cohere.command-light-text-v14', displayName: 'Command Light Text' },
          { id: 'cohere.embed-english-v3', displayName: 'Embed English' },
          { id: 'cohere.embed-multilingual-v3', displayName: 'Embed Multilingual' }
        ]
      },
      {
        name: 'Meta',
        models: [
          { id: 'meta.llama2-13b-chat-v1', displayName: 'Llama 2 13B Chat' },
          { id: 'meta.llama2-70b-chat-v1', displayName: 'Llama 2 70B Chat' },
          { id: 'meta.llama3-8b-instruct-v1:0', displayName: 'Llama 3 8B Instruct' },
          { id: 'meta.llama3-70b-instruct-v1:0', displayName: 'Llama 3 70B Instruct' }
        ]
      },
      {
        name: 'Stability AI',
        models: [
          { id: 'stability.stable-diffusion-xl-v1', displayName: 'Stable Diffusion XL' },
          { id: 'stability.stable-image-core-v1:0', displayName: 'Stable Image Core' },
          { id: 'stability.stable-image-ultra-v1:0', displayName: 'Stable Image Ultra' }
        ]
      }
    ];
    
    // Update cache
    cachedModels = mockProviders;
    lastFetchTime = now;
    
    return NextResponse.json({ providers: mockProviders });
    
  } catch (error) {
    console.error('Error fetching Bedrock models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Bedrock models' },
      { status: 500 }
    );
  }
}
