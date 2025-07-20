// src/lib/image_models.ts

export type ImageModelQuality = 'low' | 'medium' | 'high';
export type ImageModelSize = '1024x1024' | '1024x1536' | '1536x1024';

export interface ImageModelInfo {
  id: string;
  name: string;
  provider: string;
  description: string;
  qualities: Array<{
    quality: ImageModelQuality;
    sizes: Array<{
      size: ImageModelSize;
      price: number; // USD per image
    }>;
  }>;
  pricingNote?: string;
  status?: 'preview' | 'beta' | 'experimental';
}

export const AVAILABLE_IMAGE_MODELS: ImageModelInfo[] = [
  {
    id: 'gpt-image-1',
    name: 'GPT Image 1',
    provider: 'OpenAI',
    description: 'State-of-the-art image generation model. Natively multimodal, accepts text/image input and produces image output.',
    qualities: [
      {
        quality: 'low',
        sizes: [
          { size: '1024x1024', price: 0.011 },
          { size: '1024x1536', price: 0.016 },
          { size: '1536x1024', price: 0.016 },
        ],
      },
      {
        quality: 'medium',
        sizes: [
          { size: '1024x1024', price: 0.042 },
          { size: '1024x1536', price: 0.063 },
          { size: '1536x1024', price: 0.063 },
        ],
      },
      {
        quality: 'high',
        sizes: [
          { size: '1024x1024', price: 0.167 },
          { size: '1024x1536', price: 0.25 },
          { size: '1536x1024', price: 0.25 },
        ],
      },
    ],
    pricingNote: 'Pricing is per image. See OpenAI docs for details.',
    status: undefined,
  },
];

export function getImageModelById(id: string): ImageModelInfo | undefined {
  return AVAILABLE_IMAGE_MODELS.find((m) => m.id === id);
} 