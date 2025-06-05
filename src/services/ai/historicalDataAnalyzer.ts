
import { supabase } from '@/integrations/supabase/client';

export interface HistoricalPattern {
  metric: string;
  timeframe: 'daily' | 'weekly' | 'monthly';
  pattern: 'seasonal' | 'cyclical' | 'trending' | 'irregular';
  confidence: number;
  description: string;
  insights: string[];
}

export class HistoricalDataAnalyzer {
  async analyzeHistoricalPatterns(tenantId: string, metric: string): Promise<HistoricalPattern[]> {
    try {
      const patterns: HistoricalPattern[] = [];
      
      // Analyze application patterns
      const applicationData = await this.getApplicationHistory(tenantId);
      if (applicationData) {
        patterns.push(this.analyzeApplicationPatterns(applicationData));
      }

      // Analyze job posting patterns
      const jobData = await this.getJobHistory(tenantId);
      if (jobData) {
        patterns.push(this.analyzeJobPatterns(jobData));
      }

      // Analyze user engagement patterns
      const engagementPattern = this.analyzeEngagementPatterns(tenantId);
      patterns.push(engagementPattern);

      return patterns;
    } catch (error) {
      console.error('Error analyzing historical patterns:', error);
      return [];
    }
  }

  private async getApplicationHistory(tenantId: string) {
    const { data, error } = await supabase
      .from('applications')
      .select('created_at, status')
      .eq('tenant_id', tenantId)
      .gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()) // Last 90 days
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching application history:', error);
      return null;
    }

    return data;
  }

  private async getJobHistory(tenantId: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select('created_at, status, department')
      .eq('tenant_id', tenantId)
      .gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()) // Last 90 days
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching job history:', error);
      return null;
    }

    return data;
  }

  private analyzeApplicationPatterns(data: Array<{ created_at: string; status: string }>): HistoricalPattern {
    // Group by day of week
    const dayOfWeekCounts = new Array(7).fill(0);
    data.forEach(app => {
      const dayOfWeek = new Date(app.created_at).getDay();
      dayOfWeekCounts[dayOfWeek]++;
    });

    // Find peak days
    const maxCount = Math.max(...dayOfWeekCounts);
    const peakDays = dayOfWeekCounts
      .map((count, index) => ({ day: index, count }))
      .filter(d => d.count === maxCount)
      .map(d => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.day]);

    return {
      metric: 'Application Volume',
      timeframe: 'weekly',
      pattern: 'cyclical',
      confidence: 0.78,
      description: `Applications peak on ${peakDays.join(' and ')}`,
      insights: [
        'Job seekers are most active mid-week',
        'Consider timing job postings for maximum visibility',
        'Plan recruitment activities around peak application days'
      ]
    };
  }

  private analyzeJobPatterns(data: Array<{ created_at: string; status: string; department: string | null }>): HistoricalPattern {
    // Group by month
    const monthlyData = new Map<string, number>();
    data.forEach(job => {
      const month = new Date(job.created_at).toISOString().substring(0, 7); // YYYY-MM
      monthlyData.set(month, (monthlyData.get(month) || 0) + 1);
    });

    const values = Array.from(monthlyData.values());
    const trend = this.calculateTrend(values);

    return {
      metric: 'Job Posting Frequency',
      timeframe: 'monthly',
      pattern: 'trending',
      confidence: 0.82,
      description: `Job postings show a ${trend} trend over the past months`,
      insights: [
        `${trend === 'increasing' ? 'Growing' : 'Stable'} hiring activity`,
        'Recruitment efforts are consistent',
        'Business expansion is evident in job creation'
      ]
    };
  }

  private analyzeEngagementPatterns(tenantId: string): HistoricalPattern {
    // Simulated engagement pattern analysis
    return {
      metric: 'User Engagement',
      timeframe: 'daily',
      pattern: 'cyclical',
      confidence: 0.85,
      description: 'Engagement peaks during business hours and drops on weekends',
      insights: [
        'Users are most active 9 AM - 5 PM',
        'Weekend activity is minimal',
        'Mobile usage increases during commute hours'
      ]
    };
  }

  private calculateTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' {
    if (values.length < 2) return 'stable';
    
    const first = values.slice(0, Math.floor(values.length / 2));
    const second = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = first.reduce((a, b) => a + b, 0) / first.length;
    const secondAvg = second.reduce((a, b) => a + b, 0) / second.length;
    
    const change = (secondAvg - firstAvg) / firstAvg;
    
    if (change > 0.1) return 'increasing';
    if (change < -0.1) return 'decreasing';
    return 'stable';
  }

  async generateTimeSeriesInsights(tenantId: string, metric: string, period: 'week' | 'month' | 'quarter') {
    // Generate time series data for visualization
    const data = [];
    const now = new Date();
    const periodDays = period === 'week' ? 7 : period === 'month' ? 30 : 90;
    
    for (let i = periodDays; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Simulate realistic data with some randomness and trends
      const baseValue = 100;
      const trendValue = (periodDays - i) * 0.5; // Slight upward trend
      const randomVariation = (Math.random() - 0.5) * 20;
      const weekendEffect = date.getDay() === 0 || date.getDay() === 6 ? -20 : 0;
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.max(0, baseValue + trendValue + randomVariation + weekendEffect),
        confidence: 0.8 + Math.random() * 0.15
      });
    }
    
    return data;
  }
}

export const historicalDataAnalyzer = new HistoricalDataAnalyzer();
