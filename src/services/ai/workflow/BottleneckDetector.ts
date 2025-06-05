
export interface WorkflowBottleneck {
  id: string;
  stepId: string;
  stepName: string;
  type: 'time_delay' | 'error_prone' | 'resource_constraint' | 'user_abandonment';
  severity: 'low' | 'medium' | 'high' | 'critical';
  impact: number; // 0-1 scale
  description: string;
  suggestedSolutions: string[];
  detectedAt: Date;
  affectedWorkflows: string[];
}

export interface BottleneckAnalysis {
  workflowId: string;
  analysisDate: Date;
  overallEfficiencyScore: number; // 0-1 scale
  bottlenecks: WorkflowBottleneck[];
  recommendations: string[];
  estimatedImprovementPotential: number; // percentage
}

class BottleneckDetectorService {
  async detectBottlenecks(workflowId: string, executionData: any[]): Promise<BottleneckAnalysis> {
    const bottlenecks: WorkflowBottleneck[] = [];
    
    // Analyze execution times for each step
    const timeBottlenecks = this.analyzeExecutionTimes(executionData);
    bottlenecks.push(...timeBottlenecks);
    
    // Analyze error patterns
    const errorBottlenecks = this.analyzeErrorPatterns(executionData);
    bottlenecks.push(...errorBottlenecks);
    
    // Analyze user behavior patterns
    const behaviorBottlenecks = this.analyzeUserBehavior(executionData);
    bottlenecks.push(...behaviorBottlenecks);
    
    // Calculate overall efficiency score
    const efficiencyScore = this.calculateEfficiencyScore(bottlenecks);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(bottlenecks);
    
    return {
      workflowId,
      analysisDate: new Date(),
      overallEfficiencyScore: efficiencyScore,
      bottlenecks,
      recommendations,
      estimatedImprovementPotential: this.calculateImprovementPotential(bottlenecks)
    };
  }

  private analyzeExecutionTimes(executionData: any[]): WorkflowBottleneck[] {
    const bottlenecks: WorkflowBottleneck[] = [];
    
    // Group execution data by step
    const stepExecutions = new Map<string, number[]>();
    
    executionData.forEach(execution => {
      if (execution.steps) {
        execution.steps.forEach((step: any) => {
          if (!stepExecutions.has(step.id)) {
            stepExecutions.set(step.id, []);
          }
          if (step.executionTime) {
            stepExecutions.get(step.id)!.push(step.executionTime);
          }
        });
      }
    });

    // Analyze each step's performance
    stepExecutions.forEach((times, stepId) => {
      const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
      const maxTime = Math.max(...times);
      
      // If average time is significantly high or max time indicates occasional long delays
      if (avgTime > 120000 || maxTime > 300000) { // 2 minutes average or 5 minutes max
        bottlenecks.push({
          id: `bottleneck_${stepId}_${Date.now()}`,
          stepId,
          stepName: `Step ${stepId}`,
          type: 'time_delay',
          severity: avgTime > 300000 ? 'critical' : avgTime > 180000 ? 'high' : 'medium',
          impact: Math.min(avgTime / 300000, 1), // Normalize to 0-1 scale
          description: `Step takes an average of ${Math.round(avgTime / 1000)} seconds to complete`,
          suggestedSolutions: [
            'Optimize step logic',
            'Add parallel processing',
            'Cache frequently used data',
            'Reduce external API calls'
          ],
          detectedAt: new Date(),
          affectedWorkflows: [stepId] // In reality, this would track actual workflow IDs
        });
      }
    });

    return bottlenecks;
  }

  private analyzeErrorPatterns(executionData: any[]): WorkflowBottleneck[] {
    const bottlenecks: WorkflowBottleneck[] = [];
    
    // Count errors by step
    const stepErrors = new Map<string, number>();
    const stepTotal = new Map<string, number>();
    
    executionData.forEach(execution => {
      if (execution.steps) {
        execution.steps.forEach((step: any) => {
          const stepId = step.id;
          stepTotal.set(stepId, (stepTotal.get(stepId) || 0) + 1);
          
          if (step.status === 'error' || step.hasError) {
            stepErrors.set(stepId, (stepErrors.get(stepId) || 0) + 1);
          }
        });
      }
    });

    // Identify steps with high error rates
    stepErrors.forEach((errorCount, stepId) => {
      const totalCount = stepTotal.get(stepId) || 1;
      const errorRate = errorCount / totalCount;
      
      if (errorRate > 0.05) { // 5% error rate threshold
        bottlenecks.push({
          id: `bottleneck_error_${stepId}_${Date.now()}`,
          stepId,
          stepName: `Step ${stepId}`,
          type: 'error_prone',
          severity: errorRate > 0.2 ? 'critical' : errorRate > 0.1 ? 'high' : 'medium',
          impact: errorRate,
          description: `Step has a ${Math.round(errorRate * 100)}% error rate`,
          suggestedSolutions: [
            'Add input validation',
            'Improve error handling',
            'Add retry mechanisms',
            'Provide better user guidance'
          ],
          detectedAt: new Date(),
          affectedWorkflows: [stepId]
        });
      }
    });

    return bottlenecks;
  }

  private analyzeUserBehavior(executionData: any[]): WorkflowBottleneck[] {
    const bottlenecks: WorkflowBottleneck[] = [];
    
    // Analyze abandonment patterns
    const stepAbandonments = new Map<string, number>();
    const stepStarts = new Map<string, number>();
    
    executionData.forEach(execution => {
      if (execution.steps) {
        execution.steps.forEach((step: any, index: number) => {
          const stepId = step.id;
          stepStarts.set(stepId, (stepStarts.get(stepId) || 0) + 1);
          
          // If user abandoned workflow at this step
          if (step.status === 'abandoned' || (index === execution.steps.length - 1 && execution.status === 'abandoned')) {
            stepAbandonments.set(stepId, (stepAbandonments.get(stepId) || 0) + 1);
          }
        });
      }
    });

    // Identify steps with high abandonment rates
    stepAbandonments.forEach((abandonmentCount, stepId) => {
      const startCount = stepStarts.get(stepId) || 1;
      const abandonmentRate = abandonmentCount / startCount;
      
      if (abandonmentRate > 0.15) { // 15% abandonment rate threshold
        bottlenecks.push({
          id: `bottleneck_abandon_${stepId}_${Date.now()}`,
          stepId,
          stepName: `Step ${stepId}`,
          type: 'user_abandonment',
          severity: abandonmentRate > 0.4 ? 'critical' : abandonmentRate > 0.25 ? 'high' : 'medium',
          impact: abandonmentRate,
          description: `${Math.round(abandonmentRate * 100)}% of users abandon the workflow at this step`,
          suggestedSolutions: [
            'Simplify user interface',
            'Reduce required fields',
            'Add progress indicators',
            'Provide help text or tutorials'
          ],
          detectedAt: new Date(),
          affectedWorkflows: [stepId]
        });
      }
    });

    return bottlenecks;
  }

  private calculateEfficiencyScore(bottlenecks: WorkflowBottleneck[]): number {
    if (bottlenecks.length === 0) return 1.0;
    
    const totalImpact = bottlenecks.reduce((sum, bottleneck) => {
      const severityWeight = {
        low: 0.25,
        medium: 0.5,
        high: 0.75,
        critical: 1.0
      };
      return sum + (bottleneck.impact * severityWeight[bottleneck.severity]);
    }, 0);
    
    // Normalize and invert (higher efficiency = lower total impact)
    const maxPossibleImpact = bottlenecks.length * 1.0; // If all were critical with full impact
    return Math.max(0, 1 - (totalImpact / maxPossibleImpact));
  }

  private generateRecommendations(bottlenecks: WorkflowBottleneck[]): string[] {
    const recommendations: string[] = [];
    
    // Priority recommendations based on bottleneck severity
    const criticalBottlenecks = bottlenecks.filter(b => b.severity === 'critical');
    const highBottlenecks = bottlenecks.filter(b => b.severity === 'high');
    
    if (criticalBottlenecks.length > 0) {
      recommendations.push('Address critical bottlenecks immediately to prevent workflow failures');
      recommendations.push('Consider temporary workarounds while implementing permanent fixes');
    }
    
    if (highBottlenecks.length > 0) {
      recommendations.push('Prioritize high-impact bottlenecks in the next development cycle');
    }
    
    // Type-specific recommendations
    const timeBottlenecks = bottlenecks.filter(b => b.type === 'time_delay');
    const errorBottlenecks = bottlenecks.filter(b => b.type === 'error_prone');
    const abandonmentBottlenecks = bottlenecks.filter(b => b.type === 'user_abandonment');
    
    if (timeBottlenecks.length > 0) {
      recommendations.push('Implement caching and parallel processing to reduce execution times');
    }
    
    if (errorBottlenecks.length > 0) {
      recommendations.push('Enhance input validation and error handling mechanisms');
    }
    
    if (abandonmentBottlenecks.length > 0) {
      recommendations.push('Improve user experience and provide better guidance');
    }
    
    return recommendations;
  }

  private calculateImprovementPotential(bottlenecks: WorkflowBottleneck[]): number {
    if (bottlenecks.length === 0) return 0;
    
    // Calculate potential improvement based on bottleneck impacts
    const totalImpact = bottlenecks.reduce((sum, bottleneck) => sum + bottleneck.impact, 0);
    const averageImpact = totalImpact / bottlenecks.length;
    
    // Convert to percentage improvement potential
    return Math.min(averageImpact * 100, 80); // Cap at 80% improvement potential
  }

  async generateBottleneckReport(analysis: BottleneckAnalysis): Promise<string> {
    const report = `
# Workflow Bottleneck Analysis Report

**Workflow ID:** ${analysis.workflowId}
**Analysis Date:** ${analysis.analysisDate.toISOString()}
**Overall Efficiency Score:** ${Math.round(analysis.overallEfficiencyScore * 100)}%
**Improvement Potential:** ${Math.round(analysis.estimatedImprovementPotential)}%

## Identified Bottlenecks (${analysis.bottlenecks.length})

${analysis.bottlenecks.map(bottleneck => `
### ${bottleneck.stepName} - ${bottleneck.severity.toUpperCase()}
- **Type:** ${bottleneck.type.replace('_', ' ')}
- **Impact:** ${Math.round(bottleneck.impact * 100)}%
- **Description:** ${bottleneck.description}
- **Solutions:**
${bottleneck.suggestedSolutions.map(solution => `  - ${solution}`).join('\n')}
`).join('\n')}

## Recommendations
${analysis.recommendations.map(rec => `- ${rec}`).join('\n')}
    `;
    
    return report.trim();
  }
}

export const bottleneckDetectorService = new BottleneckDetectorService();
