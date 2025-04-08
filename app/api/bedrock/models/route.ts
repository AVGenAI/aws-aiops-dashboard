import { NextRequest, NextResponse } from 'next/server';

// This would typically come from a database or AWS SDK
// For this example, we'll use mock data
const modelData = {
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

export async function GET(request: NextRequest) {
  try {
    // Get environment from query parameters
    const searchParams = request.nextUrl.searchParams;
    const environment = searchParams.get('environment') || 'dev';
    
    // Get model data for the specified environment
    const envModelData = modelData[environment as keyof typeof modelData] || modelData['dev'];
    
    // Return the model data
    return NextResponse.json(envModelData);
  } catch (error) {
    console.error('Error fetching Bedrock models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Bedrock models' },
      { status: 500 }
    );
  }
}
