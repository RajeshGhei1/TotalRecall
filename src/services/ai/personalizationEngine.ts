
import { UserPreference, SmartContext } from './behavioralService/enhancedBehavioralService';
import { BehavioralPattern } from '@/types/ai';

export interface PersonalizationRule {
  id: string;
  name: string;
  condition: (context: SmartContext, preferences: UserPreference[]) => boolean;
  adaptation: UIAdaptation;
  priority: number;
  confidence: number;
}

export interface UIAdaptation {
  type: 'layout' | 'navigation' | 'content' | 'style' | 'workflow';
  target: string;
  changes: Record<string, any>;
  duration?: number;
}

export interface PersonalizedRecommendation {
  id: string;
  type: 'action' | 'navigation' | 'content' | 'workflow';
  title: string;
  description: string;
  action: () => void;
  confidence: number;
  priority: number;
}

export interface NavigationRecommendation {
  path: string;
  label: string;
  reason: string;
  confidence: number;
  estimatedValue: number;
}

export class PersonalizationEngine {
  private personalizationRules: PersonalizationRule[] = [];
  private activeAdaptations: Map<string, UIAdaptation> = new Map();
  private userPreferenceCache: Map<string, UserPreference[]> = new Map();

  constructor() {
    this.initializeDefaultRules();
  }

  // Dynamic UI adaptation based on user behavior
  async adaptUI(
    userId: string, 
    context: SmartContext, 
    preferences: UserPreference[]
  ): Promise<UIAdaptation[]> {
    this.userPreferenceCache.set(userId, preferences);
    
    const applicableRules = this.personalizationRules
      .filter(rule => rule.condition(context, preferences))
      .sort((a, b) => b.priority - a.priority);

    const adaptations: UIAdaptation[] = [];

    for (const rule of applicableRules) {
      if (rule.confidence > 0.6) {
        adaptations.push(rule.adaptation);
        this.activeAdaptations.set(`${userId}_${rule.id}`, rule.adaptation);
      }
    }

    return adaptations;
  }

  // Smart navigation recommendations
  generateNavigationRecommendations(
    context: SmartContext, 
    preferences: UserPreference[],
    patterns: BehavioralPattern[]
  ): NavigationRecommendation[] {
    const recommendations: NavigationRecommendation[] = [];

    // Analyze navigation patterns
    const navigationPatterns = patterns.filter(p => p.pattern_type === 'navigation');
    
    navigationPatterns.forEach(pattern => {
      const patternData = pattern.pattern_data;
      if (patternData.frequency_score > 0.5) {
        recommendations.push({
          path: patternData.target_path,
          label: patternData.target_label || 'Recommended Page',
          reason: `You frequently visit this after ${context.currentModule}`,
          confidence: patternData.frequency_score,
          estimatedValue: this.calculateEstimatedValue(pattern, context)
        });
      }
    });

    // Add preference-based recommendations
    const navPreferences = preferences.filter(p => p.category === 'navigation');
    navPreferences.forEach(pref => {
      if (pref.confidence > 0.7) {
        recommendations.push({
          path: pref.value,
          label: `Go to ${pref.preference}`,
          reason: 'Based on your preferences',
          confidence: pref.confidence,
          estimatedValue: 0.8
        });
      }
    });

    return recommendations
      .sort((a, b) => b.estimatedValue - a.estimatedValue)
      .slice(0, 5);
  }

  // Contextual help system
  generateContextualHelp(
    context: SmartContext,
    userPatterns: BehavioralPattern[]
  ): PersonalizedRecommendation[] {
    const recommendations: PersonalizedRecommendation[] = [];

    // Analyze user's common pain points
    const errorPatterns = userPatterns.filter(p => 
      p.pattern_type === 'error' || p.pattern_type === 'struggle'
    );

    errorPatterns.forEach(pattern => {
      const patternData = pattern.pattern_data;
      if (patternData.frequency_score > 0.3) {
        recommendations.push({
          id: `help_${pattern.id}`,
          type: 'action',
          title: `Need help with ${patternData.error_context}?`,
          description: `We noticed you've encountered this ${patternData.frequency} times`,
          action: () => this.showContextualHelp(patternData.error_context),
          confidence: patternData.frequency_score,
          priority: 9
        });
      }
    });

    // Add workflow optimization suggestions
    if (context.workflowStage === 'creation') {
      recommendations.push({
        id: 'workflow_optimization',
        type: 'workflow',
        title: 'Streamline your workflow',
        description: 'Use our quick-create templates to save time',
        action: () => this.showWorkflowOptimization(),
        confidence: 0.8,
        priority: 7
      });
    }

    return recommendations
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3);
  }

  // Personalized dashboard widgets
  generatePersonalizedWidgets(
    userId: string,
    preferences: UserPreference[],
    patterns: BehavioralPattern[]
  ): unknown[] {
    const widgets: unknown[] = [];

    // Analyze most used modules
    const moduleUsage = patterns
      .filter(p => p.pattern_type === 'module_usage')
      .sort((a, b) => b.frequency_score! - a.frequency_score!)
      .slice(0, 4);

    moduleUsage.forEach((pattern, index) => {
      widgets.push({
        id: `module_${pattern.id}`,
        type: 'quick_access',
        title: `${pattern.pattern_data.module_name} Quick Access`,
        module: pattern.pattern_data.module_name,
        priority: 10 - index,
        position: { x: index % 2, y: Math.floor(index / 2) }
      });
    });

    // Add preference-based widgets
    const dashboardPrefs = preferences.filter(p => p.category === 'dashboard');
    dashboardPrefs.forEach(pref => {
      if (pref.confidence > 0.6) {
        widgets.push({
          id: `pref_${pref.preference}`,
          type: pref.preference,
          title: `Your ${pref.preference}`,
          config: pref.value,
          priority: Math.round(pref.confidence * 10)
        });
      }
    });

    // Add time-based widgets
    if (this.isWorkingHours()) {
      widgets.push({
        id: 'productivity_tracker',
        type: 'metrics',
        title: 'Today\'s Productivity',
        config: { timeRange: 'today' },
        priority: 8
      });
    }

    return widgets.sort((a, b) => b.priority - a.priority);
  }

  // Apply UI adaptations
  applyAdaptation(adaptation: UIAdaptation): void {
    switch (adaptation.type) {
      case 'layout':
        this.applyLayoutAdaptation(adaptation);
        break;
      case 'navigation':
        this.applyNavigationAdaptation(adaptation);
        break;
      case 'content':
        this.applyContentAdaptation(adaptation);
        break;
      case 'style':
        this.applyStyleAdaptation(adaptation);
        break;
      case 'workflow':
        this.applyWorkflowAdaptation(adaptation);
        break;
    }
  }

  // Remove active adaptation
  removeAdaptation(userId: string, ruleId: string): void {
    const key = `${userId}_${ruleId}`;
    this.activeAdaptations.delete(key);
  }

  // Get active adaptations for user
  getActiveAdaptations(userId: string): UIAdaptation[] {
    const userAdaptations: UIAdaptation[] = [];
    
    for (const [key, adaptation] of this.activeAdaptations.entries()) {
      if (key.startsWith(userId)) {
        userAdaptations.push(adaptation);
      }
    }
    
    return userAdaptations;
  }

  private initializeDefaultRules(): void {
    // Mobile layout adaptation
    this.personalizationRules.push({
      id: 'mobile_layout',
      name: 'Mobile Layout Optimization',
      condition: (context) => context.deviceContext === 'mobile',
      adaptation: {
        type: 'layout',
        target: 'main_layout',
        changes: { 
          sidebarCollapsed: true, 
          compactMode: true,
          touchOptimized: true 
        }
      },
      priority: 9,
      confidence: 0.95
    });

    // Frequent module quick access
    this.personalizationRules.push({
      id: 'frequent_module_shortcut',
      name: 'Quick Access for Frequent Modules',
      condition: (context, preferences) => {
        const modulePrefs = preferences.filter(p => 
          p.category === 'navigation' && p.confidence > 0.8
        );
        return modulePrefs.length > 0;
      },
      adaptation: {
        type: 'navigation',
        target: 'sidebar',
        changes: { showQuickAccess: true }
      },
      priority: 8,
      confidence: 0.85
    });

    // Time-based adaptations
    this.personalizationRules.push({
      id: 'night_mode',
      name: 'Night Mode Suggestion',
      condition: (context) => context.timeContext === 'night',
      adaptation: {
        type: 'style',
        target: 'theme',
        changes: { theme: 'dark', reducedBrightness: true }
      },
      priority: 6,
      confidence: 0.7
    });

    // Workflow optimization
    this.personalizationRules.push({
      id: 'workflow_shortcuts',
      name: 'Workflow Shortcuts',
      condition: (context, preferences) => {
        const workflowPrefs = preferences.filter(p => 
          p.category === 'workflow' && p.confidence > 0.7
        );
        return workflowPrefs.length > 2;
      },
      adaptation: {
        type: 'workflow',
        target: 'toolbar',
        changes: { showAdvancedTools: true, showShortcuts: true }
      },
      priority: 7,
      confidence: 0.8
    });
  }

  private calculateEstimatedValue(pattern: BehavioralPattern, context: SmartContext): number {
    let value = pattern.frequency_score || 0;
    
    // Boost value for current context relevance
    if (pattern.pattern_data.source_module === context.currentModule) {
      value *= 1.5;
    }
    
    // Consider time context
    if (pattern.pattern_data.time_context === context.timeContext) {
      value *= 1.2;
    }
    
    return Math.min(value, 1.0);
  }

  private isWorkingHours(): boolean {
    const hour = new Date().getHours();
    return hour >= 9 && hour < 17;
  }

  private showContextualHelp(context: string): void {
    // Implementation for showing contextual help
    console.log(`Showing help for: ${context}`);
  }

  private showWorkflowOptimization(): void {
    // Implementation for showing workflow optimization
    console.log('Showing workflow optimization suggestions');
  }

  private applyLayoutAdaptation(adaptation: UIAdaptation): void {
    // Apply layout changes
    const changes = adaptation.changes;
    if (changes.sidebarCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    }
    if (changes.compactMode) {
      document.body.classList.add('compact-mode');
    }
  }

  private applyNavigationAdaptation(adaptation: UIAdaptation): void {
    // Apply navigation changes
    console.log('Applying navigation adaptation:', adaptation.changes);
  }

  private applyContentAdaptation(adaptation: UIAdaptation): void {
    // Apply content changes
    console.log('Applying content adaptation:', adaptation.changes);
  }

  private applyStyleAdaptation(adaptation: UIAdaptation): void {
    // Apply style changes
    const changes = adaptation.changes;
    if (changes.theme === 'dark') {
      document.body.classList.add('dark-theme');
    }
  }

  private applyWorkflowAdaptation(adaptation: UIAdaptation): void {
    // Apply workflow changes
    console.log('Applying workflow adaptation:', adaptation.changes);
  }
}

export const personalizationEngine = new PersonalizationEngine();
