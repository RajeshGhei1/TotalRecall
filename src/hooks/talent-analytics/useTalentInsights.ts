
import { useQuery } from '@tanstack/react-query';
import { useTenantContext } from '@/contexts/TenantContext';

interface TalentInsight {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'warning' | 'negative' | 'trending';
  confidence: number;
  generatedAt: string;
  actionable: boolean;
}

export const useTalentInsights = () => {
  const { selectedTenantId } = useTenantContext();

  return useQuery({
    queryKey: ['talent-insights', selectedTenantId],
    queryFn: async (): Promise<TalentInsight[]> => {
      // TODO: Replace with actual AI insights API call
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
      
      return [
        {
          id: '1',
          title: 'High Retention Risk Detected',
          description: 'AI analysis indicates 3 senior developers showing signs of potential departure within the next 60 days based on engagement patterns.',
          type: 'warning',
          confidence: 87,
          generatedAt: '2 hours ago',
          actionable: true
        },
        {
          id: '2',
          title: 'Skills Gap in AI/ML Team',
          description: 'Machine learning team lacks deep learning expertise. Recommend hiring or training within 3 months to meet Q2 project goals.',
          type: 'negative',
          confidence: 92,
          generatedAt: '4 hours ago',
          actionable: true
        },
        {
          id: '3',
          title: 'Exceptional Team Performance',
          description: 'Product team showing 25% above-average productivity this quarter. Consider expanding similar methodologies to other teams.',
          type: 'positive',
          confidence: 95,
          generatedAt: '1 day ago',
          actionable: true
        },
        {
          id: '4',
          title: 'Emerging Leadership Potential',
          description: 'Sarah Johnson demonstrates strong leadership qualities based on peer feedback and project outcomes. Consider for management track.',
          type: 'trending',
          confidence: 89,
          generatedAt: '1 day ago',
          actionable: true
        }
      ];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!selectedTenantId
  });
};
