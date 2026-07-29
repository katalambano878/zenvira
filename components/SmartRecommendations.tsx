'use client';

interface SmartRecommendationsProps {
  productId?: string;
  type: 'similar' | 'also-bought' | 'personalized' | 'complete-look' | 'trending';
  title?: string;
}

export default function SmartRecommendations(_props: SmartRecommendationsProps) {
  return null;
}
