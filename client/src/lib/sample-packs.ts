import type { SamplePack } from "@shared/schema";

// Price formatter utility
export function formatPrice(price: number): string {
  return `$${(price / 100).toFixed(2)}`;
}

// Sample pack categories for filtering (can be extended)
export const PACK_CATEGORIES = [
  'All',
  'Cyberpunk',
  'Future Bass',
  'Synthwave',
  'Glitch',
  'Ambient',
] as const;

export type PackCategory = typeof PACK_CATEGORIES[number];

// Helper to format the SoundCloud embed URL
export function getSoundCloudEmbedUrl(url: string): string {
  // If it's already an embed URL, return as is
  if (url.includes('player.soundcloud.com')) {
    return url;
  }

  // Basic transformation of regular URL to embed URL
  // Note: This is a simplified version, in production you'd want more robust URL parsing
  const trackUrl = encodeURIComponent(url);
  return `https://w.soundcloud.com/player/?url=${trackUrl}&color=%2300ffff&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`;
}

// Helper to validate a sample pack's data
export function validateSamplePack(pack: Partial<SamplePack>): pack is SamplePack {
  return (
    typeof pack.id === 'number' &&
    typeof pack.title === 'string' &&
    typeof pack.description === 'string' &&
    typeof pack.price === 'number' &&
    typeof pack.imageUrl === 'string' &&
    typeof pack.demoUrl === 'string'
  );
}

// Helper to sort sample packs by different criteria
export function sortSamplePacks(packs: SamplePack[], sortBy: 'price' | 'title' = 'title'): SamplePack[] {
  return [...packs].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });
}

// Helper to filter featured packs
export function getFeaturedPacks(packs: SamplePack[]): SamplePack[] {
  return packs.filter(pack => pack.featured === 1);
}

// Utility to generate a mock waveform data for visualization
// This could be replaced with actual waveform data in production
export function generateMockWaveform(length: number = 100): number[] {
  return Array.from({ length }, () => Math.random());
}

// Constants for the application
export const PACK_CONSTANTS = {
  MAX_TITLE_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 200,
  MIN_PRICE: 99, // $0.99
  MAX_PRICE: 9999, // $99.99
  DEFAULT_CURRENCY: 'USD',
  SUPPORTED_AUDIO_FORMATS: ['mp3', 'wav', 'aiff'],
  IMAGE_ASPECT_RATIO: 16 / 9,
} as const;

// Type guard for checking if a URL is an image
export function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|webp|avif)$/.test(url);
}

// Helper to generate a placeholder image URL if the main image fails to load
export function getPlaceholderImage(): string {
  return 'https://images.unsplash.com/photo-1470019693664-1d202d2c0907';
}
