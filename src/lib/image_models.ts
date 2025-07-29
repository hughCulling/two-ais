// src/lib/image_models.ts

export type ImageModelQuality = 'low' | 'medium' | 'high' | 'standard' | 'hd';
export type ImageModelSize = '256x256' | '512x512' | '1024x1024' | '1024x1536' | '1536x1024';
export type ImageAspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export interface ImageModelInfo {
  id: string;
  name: string;
  provider: string;
  description: string;
  qualities: Array<{
    quality: ImageModelQuality;
    sizes: Array<{
      size: ImageModelSize | ImageAspectRatio;
      price: number; // USD per image
    }>;
  }>;
  pricingNote?: string;
  status?: 'preview' | 'beta' | 'experimental';
  requiresOrgVerification?: boolean;
  supportsAspectRatio?: boolean;
  defaultAspectRatio?: ImageAspectRatio;
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
    requiresOrgVerification: true,
  },
  {
    id: 'dall-e-3',
    name: 'DALL·E 3',
    provider: 'OpenAI',
    description: 'High quality image generation model. Supports standard and HD quality.',
    qualities: [
      {
        quality: 'standard',
        sizes: [
          { size: '1024x1024', price: 0.04 },
          { size: '1024x1536', price: 0.08 },
          { size: '1536x1024', price: 0.08 },
        ],
      },
      {
        quality: 'hd',
        sizes: [
          { size: '1024x1024', price: 0.08 },
          { size: '1024x1536', price: 0.12 },
          { size: '1536x1024', price: 0.12 },
        ],
      },
    ],
    pricingNote: 'Pricing is per image. See OpenAI docs for details.',
    status: undefined,
  },
  {
    id: 'dall-e-2',
    name: 'DALL·E 2',
    provider: 'OpenAI',
    description: 'Previous generation image generation model. Lower cost, supports 1024x1024, 1024x1536, 1536x1024.',
    qualities: [
      {
        quality: 'standard',
        sizes: [
          { size: '1024x1024', price: 0.016 },
          { size: '1024x1536', price: 0.018 },
          { size: '1536x1024', price: 0.02 },
        ],
      },
    ],
    pricingNote: 'Pricing is per image. See OpenAI docs for details.',
    status: undefined,
  },
  {
    id: 'imagen-4.0-generate-preview-06-06',
    name: 'Imagen 4 Standard',
    provider: 'Google',
    description: 'Latest image generation model with significantly better text rendering and overall image quality.',
    qualities: [
      {
        quality: 'standard',
        sizes: [
          { size: '1:1', price: 0.04 },
          { size: '3:4', price: 0.04 },
          { size: '4:3', price: 0.04 },
          { size: '9:16', price: 0.04 },
          { size: '16:9', price: 0.04 },
        ],
      },
    ],
    pricingNote: 'Pricing is per image. See Google AI docs for details.',
    status: 'preview',
    supportsAspectRatio: true,
    defaultAspectRatio: '1:1',
  },
  {
    id: 'imagen-4.0-ultra-generate-preview-06-06',
    name: 'Imagen 4 Ultra',
    provider: 'Google',
    description: 'Highest quality version of Imagen 4 with enhanced capabilities. Produces a single high-quality image per request.',
    qualities: [
      {
        quality: 'high',
        sizes: [
          { size: '1:1', price: 0.06 },
          { size: '3:4', price: 0.06 },
          { size: '4:3', price: 0.06 },
          { size: '9:16', price: 0.06 },
          { size: '16:9', price: 0.06 },
        ],
      },
    ],
    pricingNote: 'Pricing is per image. See Google AI docs for details.',
    status: 'preview',
    supportsAspectRatio: true,
    defaultAspectRatio: '1:1',
  },
  {
    id: 'imagen-3.0-generate-002',
    name: 'Imagen 3',
    provider: 'Google',
    description: 'State-of-the-art text-to-image model that generates high-quality images with excellent detail, rich lighting, and minimal artifacts. Supports generating up to 4 images per request.',
    qualities: [
      {
        quality: 'standard',
        sizes: [
          { size: '1:1', price: 0.03 },
          { size: '3:4', price: 0.03 },
          { size: '4:3', price: 0.03 },
          { size: '9:16', price: 0.03 },
          { size: '16:9', price: 0.03 },
        ],
      },
    ],
    pricingNote: 'Pricing is $0.03 per image. Available on the paid tier of Google AI. Supports multiple aspect ratios.',
    status: undefined,
    supportsAspectRatio: true,
    defaultAspectRatio: '1:1',
  },
  {
    id: 'grok-2-image-1212',
    name: 'Grok-2 Image Gen',
    provider: 'xAI',
    description: 'Latest image generation model from xAI that can generate vivid, realistic images based on text prompts. Excels at generating images for marketing, social media, and entertainment. Generates standard quality images at 1024x1024 resolution.',
    qualities: [
      {
        quality: 'standard',
        sizes: [
          { size: '1024x1024', price: 0.07 }
        ],
      },
    ],
    pricingNote: 'Pricing is $0.07 per image. Fixed resolution of 1024x1024. See xAI docs for details.',
    status: undefined,
  },
];

export function getImageModelById(id: string): ImageModelInfo | undefined {
  return AVAILABLE_IMAGE_MODELS.find((m) => m.id === id);
} 