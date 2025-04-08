import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';

// Function to get AWS credentials from environment
const getAWSCredentials = (environment: string) => {
  // In a real application, you would fetch these from a secure source
  // For this example, we'll use environment variables or default values
  switch (environment) {
    case 'dev':
      return {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID_DEV || process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_DEV || process.env.AWS_SECRET_ACCESS_KEY || '',
        region: process.env.AWS_REGION_DEV || process.env.AWS_REGION || 'us-east-1'
      };
    case 'uat':
      return {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID_UAT || process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_UAT || process.env.AWS_SECRET_ACCESS_KEY || '',
        region: process.env.AWS_REGION_UAT || process.env.AWS_REGION || 'us-east-1'
      };
    case 'prod':
      return {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID_PROD || process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_PROD || process.env.AWS_SECRET_ACCESS_KEY || '',
        region: process.env.AWS_REGION_PROD || process.env.AWS_REGION || 'us-east-1'
      };
    default:
      return {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        region: process.env.AWS_REGION || 'us-east-1'
      };
  }
};

// Fallback mock data in case AWS credentials are not available
const mockModelData = {
  'dev': {
    providers: [
      {
        name: 'Anthropic',
        models: [
          {
            id: 'anthropic.claude-v2',
            displayName: 'Claude V2',
            capabilities: ['Text Generation', 'Summarization', 'Q&A'],
            contextLength: 100000,
            costPerMillionTokens: {
              input: 8.00,
              output: 24.00
            },
            recommended: true
          },
          {
            id: 'anthropic.claude-v2:1',
            displayName: 'Claude V2:1',
            capabilities: ['Text Generation', 'Summarization', 'Q&A', 'Code Generation'],
            contextLength: 100000,
            costPerMillionTokens: {
              input: 8.00,
              output: 24.00
            },
            recommended: false
          },
          {
            id: 'anthropic.claude-instant-v1',
            displayName: 'Claude Instant V1',
            capabilities: ['Text Generation', 'Summarization', 'Q&A'],
            contextLength: 100000,
            costPerMillionTokens: {
              input: 1.63,
              output: 5.51
            },
            recommended: false
          },
          {
            id: 'anthropic.claude-3-sonnet-20240229-v1:0',
            displayName: 'Claude 3 Sonnet',
            capabilities: ['Text Generation', 'Summarization', 'Q&A', 'Code Generation', 'Advanced Reasoning'],
            contextLength: 200000,
            costPerMillionTokens: {
              input: 3.00,
              output: 15.00
            },
            recommended: true
          },
          {
            id: 'anthropic.claude-3-haiku-20240307-v1:0',
            displayName: 'Claude 3 Haiku',
            capabilities: ['Text Generation', 'Summarization', 'Q&A', 'Fast Responses'],
            contextLength: 200000,
            costPerMillionTokens: {
              input: 0.25,
              output: 1.25
            },
            recommended: true
          },
          {
            id: 'anthropic.claude-3-opus-20240229-v1:0',
            displayName: 'Claude 3 Opus',
            capabilities: ['Text Generation', 'Summarization', 'Q&A', 'Code Generation', 'Advanced Reasoning', 'Complex Tasks'],
            contextLength: 200000,
            costPerMillionTokens: {
              input: 15.00,
              output: 75.00
            },
            recommended: false
          }
        ]
      },
      {
        name: 'Amazon',
        models: [
          {
            id: 'amazon.titan-text-express-v1',
            displayName: 'Titan Text Express',
            capabilities: ['Text Generation', 'Summarization', 'Q&A'],
            contextLength: 8000,
            costPerMillionTokens: {
              input: 3.00,
              output: 4.00
            },
            recommended: false
          },
          {
            id: 'amazon.titan-text-lite-v1',
            displayName: 'Titan Text Lite',
            capabilities: ['Text Generation', 'Summarization'],
            contextLength: 4000,
            costPerMillionTokens: {
              input: 0.30,
              output: 0.40
            },
            recommended: false
          },
          {
            id: 'amazon.titan-embed-text-v1',
            displayName: 'Titan Embed Text',
            capabilities: ['Text Embeddings', 'Semantic Search'],
            contextLength: 8000,
            costPerMillionTokens: {
              input: 0.10,
              output: 0.00
            },
            recommended: false
          }
        ]
      },
      {
        name: 'Meta',
        models: [
          {
            id: 'meta.llama2-13b-chat-v1',
            displayName: 'Llama 2 13B Chat',
            capabilities: ['Text Generation', 'Summarization', 'Q&A'],
            contextLength: 4096,
            costPerMillionTokens: {
              input: 0.70,
              output: 0.90
            },
            recommended: false
          },
          {
            id: 'meta.llama2-70b-chat-v1',
            displayName: 'Llama 2 70B Chat',
            capabilities: ['Text Generation', 'Summarization', 'Q&A', 'Code Generation'],
            contextLength: 4096,
            costPerMillionTokens: {
              input: 1.00,
              output: 1.30
            },
            recommended: false
          },
          {
            id: 'meta.llama3-8b-instruct-v1:0',
            displayName: 'Llama 3 8B Instruct',
            capabilities: ['Text Generation', 'Summarization', 'Q&A'],
            contextLength: 8192,
            costPerMillionTokens: {
              input: 0.20,
              output: 0.40
            },
            recommended: false
          },
          {
            id: 'meta.llama3-70b-instruct-v1:0',
            displayName: 'Llama 3 70B Instruct',
            capabilities: ['Text Generation', 'Summarization', 'Q&A', 'Code Generation', 'Advanced Reasoning'],
            contextLength: 8192,
            costPerMillionTokens: {
              input: 0.90,
              output: 1.80
            },
            recommended: true
          }
        ]
      }
    ]
  },
  'uat': {
    providers: [
      {
        name: 'Anthropic',
        models: [
          {
            id: 'anthropic.claude-v2',
            displayName: 'Claude V2',
            capabilities: ['Text Generation', 'Summarization', 'Q&A'],
            contextLength: 100000,
            costPerMillionTokens: {
              input: 8.00,
              output: 24.00
            },
            recommended: false
          },
          {
            id: 'anthropic.claude-3-sonnet-20240229-v1:0',
            displayName: 'Claude 3 Sonnet',
            capabilities: ['Text Generation', 'Summarization', 'Q&A', 'Code Generation', 'Advanced Reasoning'],
            contextLength: 200000,
            costPerMillionTokens: {
              input: 3.00,
              output: 15.00
            },
            recommended: true
          }
        ]
      },
      {
        name: 'Amazon',
        models: [
          {
            id: 'amazon.titan-text-express-v1',
            displayName: 'Titan Text Express',
            capabilities: ['Text Generation', 'Summarization', 'Q&A'],
            contextLength: 8000,
            costPerMillionTokens: {
              input: 3.00,
              output: 4.00
            },
            recommended: false
          }
        ]
      }
    ]
  },
  'prod': {
    providers: [
      {
        name: 'Anthropic',
        models: [
          {
            id: 'anthropic.claude-3-sonnet-20240229-v1:0',
            displayName: 'Claude 3 Sonnet',
            capabilities: ['Text Generation', 'Summarization', 'Q&A', 'Code Generation', 'Advanced Reasoning'],
            contextLength: 200000,
            costPerMillionTokens: {
              input: 3.00,
              output: 15.00
            },
            recommended: true
          }
        ]
      }
    ]
  }
};

// Function to fetch Bedrock models from AWS
async function fetchBedrockModels(environment: string) {
  try {
    const credentials = getAWSCredentials(environment);
    
    // Check if AWS credentials are available
    if (!credentials.accessKeyId || !credentials.secretAccessKey) {
      console.log('AWS credentials not available, using mock data');
      return mockModelData[environment as keyof typeof mockModelData] || mockModelData['dev'];
    }
    
    // Configure AWS SDK
    AWS.config.update({
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      region: credentials.region
    });
    
    // Initialize Bedrock client
    const bedrock = new AWS.Bedrock({ apiVersion: '2023-04-20' });
    
    // In a real implementation, you would call the Bedrock API to get the list of models
    // For example:
    // const result = await bedrock.listFoundationModels().promise();
    
    // Since we might not have actual AWS credentials for testing, we'll use mock data for now
    // but in a real implementation, you would transform the API response into the expected format
    
    return mockModelData[environment as keyof typeof mockModelData] || mockModelData['dev'];
  } catch (error) {
    console.error('Error fetching Bedrock models from AWS:', error);
    return mockModelData[environment as keyof typeof mockModelData] || mockModelData['dev'];
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get environment from query parameters
    const searchParams = request.nextUrl.searchParams;
    const environment = searchParams.get('environment') || 'dev';
    
    // Fetch model data for the specified environment
    const modelData = await fetchBedrockModels(environment);
    
    // Return the model data
    return NextResponse.json(modelData);
  } catch (error) {
    console.error('Error fetching Bedrock models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Bedrock models' },
      { status: 500 }
    );
  }
}
