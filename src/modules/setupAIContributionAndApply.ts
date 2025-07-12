import { createClient } from '@supabase/supabase-js';

// Use the same Supabase configuration as the main application
const SUPABASE_URL = "https://mnebxichjszbuzffmesx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uZWJ4aWNoanN6YnV6ZmZtZXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3OTIzOTMsImV4cCI6MjA2MjM2ODM5M30.43QB7gpBfT5I22iK-ma2Y4K8htCh5KUILkLHaigo2zs";
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// AI Contribution definitions for each module
const AI_CONTRIBUTIONS = {
  // Production Modules - using correct database names
  'ats_core': {
    ai_capabilities: [
      'Smart Resume Parsing',
      'Candidate Ranking AI',
      'Interview Scheduling Assistant',
      'Skills Match Scoring',
      'Automated Candidate Screening'
    ],
    ai_level: 'high',
    ai_description: 'Advanced AI-powered talent acquisition with machine learning for candidate matching and automated screening workflows.',
    ai_features: {
      intelligent_parsing: 'AI extracts and categorizes resume data with 95% accuracy',
      predictive_scoring: 'ML algorithms rank candidates based on job fit probability',
      smart_scheduling: 'AI optimizes interview schedules based on availability and priorities',
      skills_analysis: 'Natural language processing identifies and matches skills',
      bias_reduction: 'AI helps reduce unconscious bias in candidate evaluation'
    }
  },
  'companies': {
    ai_capabilities: [
      'Company Intelligence Enrichment',
      'Relationship Mapping AI',
      'Market Position Analysis',
      'Contact Discovery',
      'Industry Classification'
    ],
    ai_level: 'medium',
    ai_description: 'AI-enhanced company database with intelligent data enrichment and relationship discovery.',
    ai_features: {
      data_enrichment: 'AI automatically enriches company profiles with web-scraped data',
      relationship_mapping: 'Machine learning identifies connections between companies',
      market_analysis: 'AI analyzes company position and competitive landscape',
      contact_discovery: 'AI finds and validates key decision makers',
      classification: 'Automatic industry and company type classification'
    }
  },
  'talent_database': {
    ai_capabilities: [
      'Talent Pool Analytics',
      'Skill Trend Prediction',
      'Career Path Modeling',
      'Performance Forecasting',
      'Talent Gap Analysis'
    ],
    ai_level: 'high',
    ai_description: 'AI-driven talent analytics with predictive modeling for workforce planning and talent development.',
    ai_features: {
      pool_analytics: 'AI analyzes talent pool composition and trends',
      skill_prediction: 'ML predicts emerging skill demands and gaps',
      career_modeling: 'AI models optimal career progression paths',
      performance_forecasting: 'Predictive analytics for talent performance',
      gap_analysis: 'AI identifies current and future talent gaps'
    }
  },

  // Sales & CRM Modules
  'sales_pipeline': {
    ai_capabilities: [
      'Sales Forecasting AI',
      'Deal Probability Scoring',
      'Next Best Action Recommendations',
      'Pipeline Health Analysis',
      'Revenue Prediction'
    ],
    ai_level: 'high',
    ai_description: 'AI-powered sales pipeline management with predictive analytics and intelligent deal scoring.',
    ai_features: {
      sales_forecasting: 'ML algorithms predict quarterly and annual sales with 90% accuracy',
      deal_scoring: 'AI calculates probability of deal closure based on historical data',
      action_recommendations: 'Smart suggestions for next steps to advance deals',
      health_analysis: 'AI monitors pipeline health and identifies bottlenecks',
      revenue_prediction: 'Advanced models forecast revenue by segment and time period'
    }
  },
  'lead_management': {
    ai_capabilities: [
      'Lead Scoring & Qualification',
      'Intent Signal Detection',
      'Lead Source Attribution',
      'Nurturing Campaign AI',
      'Conversion Prediction'
    ],
    ai_level: 'high',
    ai_description: 'Intelligent lead management with AI-powered scoring, qualification, and automated nurturing.',
    ai_features: {
      lead_scoring: 'ML models score leads based on conversion probability',
      intent_detection: 'AI identifies buying intent signals from behavior patterns',
      source_attribution: 'Machine learning attributes leads to optimal sources',
      nurturing_ai: 'AI personalizes and optimizes nurturing campaigns',
      conversion_prediction: 'Predictive models forecast lead-to-customer conversion'
    }
  },
  'customer_lifecycle': {
    ai_capabilities: [
      'Churn Prediction & Prevention',
      'Customer Lifetime Value AI',
      'Upsell/Cross-sell Recommendations',
      'Journey Optimization',
      'Retention Strategy AI'
    ],
    ai_level: 'high',
    ai_description: 'AI-driven customer lifecycle management with predictive analytics for retention and growth.',
    ai_features: {
      churn_prediction: 'ML predicts customer churn risk with 85% accuracy',
      clv_calculation: 'AI calculates and predicts customer lifetime value',
      recommendation_engine: 'Smart product/service recommendations for upselling',
      journey_optimization: 'AI optimizes customer journey touchpoints',
      retention_strategy: 'Personalized retention strategies powered by AI'
    }
  },

  // Marketing Modules
  'marketing_automation': {
    ai_capabilities: [
      'Campaign Optimization AI',
      'Content Personalization',
      'Send Time Optimization',
      'A/B Testing Intelligence',
      'Attribution Modeling'
    ],
    ai_level: 'high',
    ai_description: 'AI-powered marketing automation with intelligent campaign optimization and personalization.',
    ai_features: {
      campaign_optimization: 'AI continuously optimizes campaign performance',
      content_personalization: 'ML personalizes content for individual recipients',
      send_optimization: 'AI determines optimal send times for each contact',
      ab_testing: 'Intelligent A/B testing with statistical significance',
      attribution_modeling: 'AI attributes conversions across marketing channels'
    }
  },
  'market_intelligence': {
    ai_capabilities: [
      'Competitive Intelligence AI',
      'Market Trend Analysis',
      'Sentiment Analysis',
      'Opportunity Detection',
      'Risk Assessment'
    ],
    ai_level: 'medium',
    ai_description: 'AI-driven market intelligence with sentiment analysis and competitive monitoring.',
    ai_features: {
      competitive_intelligence: 'AI monitors competitor activities and pricing',
      trend_analysis: 'ML identifies emerging market trends and patterns',
      sentiment_analysis: 'Natural language processing analyzes market sentiment',
      opportunity_detection: 'AI identifies new market opportunities',
      risk_assessment: 'Predictive models assess market and competitive risks'
    }
  },

  // Operations Modules
  'inventory_management': {
    ai_capabilities: [
      'Demand Forecasting AI',
      'Inventory Optimization',
      'Stockout Prevention',
      'Supplier Performance AI',
      'Cost Optimization'
    ],
    ai_level: 'medium',
    ai_description: 'AI-enhanced inventory management with predictive demand forecasting and optimization.',
    ai_features: {
      demand_forecasting: 'ML predicts product demand with seasonal adjustments',
      inventory_optimization: 'AI optimizes stock levels to minimize costs',
      stockout_prevention: 'Predictive alerts prevent inventory shortages',
      supplier_performance: 'AI analyzes and scores supplier performance',
      cost_optimization: 'ML optimizes inventory costs and carrying charges'
    }
  },
  'supply_chain_management': {
    ai_capabilities: [
      'Supply Chain Optimization',
      'Logistics Route Planning',
      'Supplier Risk Assessment',
      'Disruption Prediction',
      'Cost Analysis AI'
    ],
    ai_level: 'medium',
    ai_description: 'AI-powered supply chain optimization with predictive logistics and risk management.',
    ai_features: {
      chain_optimization: 'AI optimizes entire supply chain for efficiency',
      route_planning: 'ML algorithms plan optimal logistics routes',
      risk_assessment: 'AI assesses supplier and logistics risks',
      disruption_prediction: 'Predictive models forecast supply chain disruptions',
      cost_analysis: 'AI analyzes and optimizes supply chain costs'
    }
  },

  // Financial Modules
  'financial_operations': {
    ai_capabilities: [
      'Financial Forecasting AI',
      'Fraud Detection',
      'Payment Risk Assessment',
      'Cash Flow Prediction',
      'Invoice Processing AI'
    ],
    ai_level: 'medium',
    ai_description: 'AI-enhanced financial operations with fraud detection and predictive analytics.',
    ai_features: {
      financial_forecasting: 'ML models predict financial performance and trends',
      fraud_detection: 'AI detects fraudulent transactions and activities',
      payment_risk: 'ML assesses payment default risks',
      cash_flow_prediction: 'AI predicts cash flow patterns and needs',
      invoice_processing: 'Automated AI-powered invoice processing and validation'
    }
  },
  'purchase_order_processing': {
    ai_capabilities: [
      'Purchase Optimization AI',
      'Vendor Recommendation',
      'Price Prediction',
      'Approval Workflow AI',
      'Spend Analysis'
    ],
    ai_level: 'low',
    ai_description: 'AI-assisted purchase order processing with vendor optimization and spend analysis.',
    ai_features: {
      purchase_optimization: 'AI optimizes purchase decisions and timing',
      vendor_recommendation: 'ML recommends optimal vendors for purchases',
      price_prediction: 'AI predicts price trends for better timing',
      workflow_ai: 'Smart routing of approvals based on patterns',
      spend_analysis: 'AI analyzes spending patterns and identifies savings'
    }
  },

  // Commerce Modules
  'order_management': {
    ai_capabilities: [
      'Order Prediction AI',
      'Priority Optimization',
      'Delivery Estimation',
      'Customer Preference AI',
      'Inventory Allocation'
    ],
    ai_level: 'medium',
    ai_description: 'AI-enhanced order management with predictive processing and optimization.',
    ai_features: {
      order_prediction: 'AI predicts order volumes and patterns',
      priority_optimization: 'ML optimizes order processing priorities',
      delivery_estimation: 'AI provides accurate delivery time estimates',
      preference_ai: 'Machine learning tracks customer preferences',
      inventory_allocation: 'AI optimizes inventory allocation for orders'
    }
  },
  'fulfillment_logistics': {
    ai_capabilities: [
      'Route Optimization AI',
      'Delivery Prediction',
      'Warehouse Automation',
      'Carrier Selection AI',
      'Cost Optimization'
    ],
    ai_level: 'medium',
    ai_description: 'AI-powered fulfillment and logistics with route optimization and predictive delivery.',
    ai_features: {
      route_optimization: 'AI optimizes delivery routes for efficiency',
      delivery_prediction: 'ML predicts accurate delivery times',
      warehouse_automation: 'AI optimizes warehouse operations and picking',
      carrier_selection: 'Smart carrier selection based on performance data',
      cost_optimization: 'AI minimizes fulfillment and shipping costs'
    }
  },

  // Project Management Modules
  'project_management': {
    ai_capabilities: [
      'Project Timeline AI',
      'Resource Allocation',
      'Risk Prediction',
      'Task Prioritization',
      'Performance Analytics'
    ],
    ai_level: 'medium',
    ai_description: 'AI-enhanced project management with predictive planning and resource optimization.',
    ai_features: {
      timeline_ai: 'AI predicts realistic project timelines and milestones',
      resource_allocation: 'ML optimizes resource allocation across projects',
      risk_prediction: 'AI identifies project risks and mitigation strategies',
      task_prioritization: 'Smart task prioritization based on impact',
      performance_analytics: 'AI analyzes team and project performance'
    }
  },
  'resource_planning': {
    ai_capabilities: [
      'Capacity Planning AI',
      'Skill Gap Analysis',
      'Workload Balancing',
      'Demand Forecasting',
      'Utilization Optimization'
    ],
    ai_level: 'medium',
    ai_description: 'AI-driven resource planning with capacity optimization and skill analysis.',
    ai_features: {
      capacity_planning: 'AI predicts resource capacity needs',
      skill_gap_analysis: 'ML identifies skill gaps and training needs',
      workload_balancing: 'AI balances workloads across resources',
      demand_forecasting: 'Predictive models forecast resource demand',
      utilization_optimization: 'AI optimizes resource utilization rates'
    }
  },

  // Support & Service Modules
  'customer_support': {
    ai_capabilities: [
      'Chatbot & Virtual Assistant',
      'Ticket Classification AI',
      'Response Suggestion',
      'Sentiment Analysis',
      'Resolution Prediction'
    ],
    ai_level: 'high',
    ai_description: 'AI-powered customer support with intelligent chatbots and automated ticket management.',
    ai_features: {
      chatbot_assistant: 'AI chatbot handles common customer inquiries',
      ticket_classification: 'ML automatically categorizes and routes tickets',
      response_suggestion: 'AI suggests responses based on knowledge base',
      sentiment_analysis: 'Real-time sentiment analysis of customer interactions',
      resolution_prediction: 'AI predicts ticket resolution time and complexity'
    }
  },
  'service_management': {
    ai_capabilities: [
      'Service Optimization AI',
      'Maintenance Prediction',
      'Technician Routing',
      'Parts Forecasting',
      'SLA Prediction'
    ],
    ai_level: 'medium',
    ai_description: 'AI-enhanced service management with predictive maintenance and optimization.',
    ai_features: {
      service_optimization: 'AI optimizes service delivery and scheduling',
      maintenance_prediction: 'Predictive maintenance using IoT and ML',
      technician_routing: 'AI optimizes field technician routes and assignments',
      parts_forecasting: 'ML predicts parts demand and inventory needs',
      sla_prediction: 'AI predicts SLA compliance and performance'
    }
  },

  // Analytics Modules
  'business_intelligence': {
    ai_capabilities: [
      'Automated Insights Generation',
      'Anomaly Detection',
      'Predictive Analytics',
      'Natural Language Queries',
      'Smart Recommendations'
    ],
    ai_level: 'high',
    ai_description: 'AI-powered business intelligence with automated insights and natural language processing.',
    ai_features: {
      automated_insights: 'AI automatically generates business insights from data',
      anomaly_detection: 'ML detects unusual patterns and outliers',
      predictive_analytics: 'Advanced predictive models for business forecasting',
      natural_language: 'Query data using natural language processing',
      smart_recommendations: 'AI recommends actions based on data analysis'
    }
  },
  'predictive_analytics': {
    ai_capabilities: [
      'Advanced ML Models',
      'Time Series Forecasting',
      'Pattern Recognition',
      'Scenario Modeling',
      'Risk Prediction'
    ],
    ai_level: 'high',
    ai_description: 'Advanced AI-driven predictive analytics with machine learning models and forecasting.',
    ai_features: {
      ml_models: 'Sophisticated machine learning models for predictions',
      time_series: 'Advanced time series analysis and forecasting',
      pattern_recognition: 'AI identifies complex patterns in data',
      scenario_modeling: 'AI models different business scenarios',
      risk_prediction: 'Predictive risk assessment across business areas'
    }
  },

  // Compliance & Governance Modules
  'compliance_management': {
    ai_capabilities: [
      'Regulatory Monitoring AI',
      'Risk Assessment',
      'Document Analysis',
      'Audit Trail Intelligence',
      'Violation Prediction'
    ],
    ai_level: 'medium',
    ai_description: 'AI-enhanced compliance management with regulatory monitoring and risk assessment.',
    ai_features: {
      regulatory_monitoring: 'AI monitors regulatory changes and requirements',
      risk_assessment: 'ML assesses compliance risks and vulnerabilities',
      document_analysis: 'AI analyzes documents for compliance issues',
      audit_intelligence: 'Smart audit trail analysis and reporting',
      violation_prediction: 'AI predicts potential compliance violations'
    }
  },
  'quality_management': {
    ai_capabilities: [
      'Quality Prediction AI',
      'Defect Detection',
      'Process Optimization',
      'Root Cause Analysis',
      'Performance Monitoring'
    ],
    ai_level: 'medium',
    ai_description: 'AI-powered quality management with predictive quality assurance and automated testing.',
    ai_features: {
      quality_prediction: 'AI predicts quality issues before they occur',
      defect_detection: 'ML automatically detects defects and anomalies',
      process_optimization: 'AI optimizes quality processes and workflows',
      root_cause_analysis: 'Machine learning identifies root causes of issues',
      performance_monitoring: 'AI monitors quality performance metrics'
    }
  },

  // Integration & Automation Modules
  'integration_hub': {
    ai_capabilities: [
      'Smart Data Mapping',
      'API Optimization',
      'Error Prediction',
      'Performance Monitoring',
      'Auto-healing Systems'
    ],
    ai_level: 'medium',
    ai_description: 'AI-enhanced integration platform with smart data mapping and automated error handling.',
    ai_features: {
      data_mapping: 'AI automatically maps data fields between systems',
      api_optimization: 'ML optimizes API performance and routing',
      error_prediction: 'AI predicts and prevents integration failures',
      performance_monitoring: 'Smart monitoring of integration performance',
      auto_healing: 'AI automatically fixes common integration issues'
    }
  },
  'workflow_engine': {
    ai_capabilities: [
      'Workflow Optimization AI',
      'Process Mining',
      'Bottleneck Detection',
      'Automation Suggestions',
      'Performance Prediction'
    ],
    ai_level: 'medium',
    ai_description: 'AI-powered workflow engine with process optimization and intelligent automation.',
    ai_features: {
      workflow_optimization: 'AI optimizes business workflow efficiency',
      process_mining: 'ML analyzes and improves business processes',
      bottleneck_detection: 'AI identifies workflow bottlenecks and delays',
      automation_suggestions: 'Smart suggestions for process automation',
      performance_prediction: 'AI predicts workflow performance outcomes'
    }
  },

  // Knowledge & Training Modules
  'knowledge_management': {
    ai_capabilities: [
      'Content Intelligence',
      'Knowledge Discovery',
      'Semantic Search',
      'Content Recommendations',
      'Auto-categorization'
    ],
    ai_level: 'high',
    ai_description: 'AI-powered knowledge management with intelligent content discovery and semantic search.',
    ai_features: {
      content_intelligence: 'AI analyzes and extracts insights from content',
      knowledge_discovery: 'ML discovers hidden knowledge and connections',
      semantic_search: 'Advanced semantic search across knowledge base',
      content_recommendations: 'AI recommends relevant content to users',
      auto_categorization: 'Automatic categorization of knowledge articles'
    }
  },
  'training_management': {
    ai_capabilities: [
      'Personalized Learning Paths',
      'Skill Gap Analysis',
      'Learning Recommendations',
      'Progress Prediction',
      'Content Optimization'
    ],
    ai_level: 'high',
    ai_description: 'AI-driven training management with personalized learning and skill development.',
    ai_features: {
      personalized_paths: 'AI creates personalized learning paths for each user',
      skill_gap_analysis: 'ML identifies individual skill gaps and needs',
      learning_recommendations: 'Smart recommendations for training content',
      progress_prediction: 'AI predicts learning progress and outcomes',
      content_optimization: 'AI optimizes training content effectiveness'
    }
  }
};

async function setupDatabaseColumns() {
  console.log('🔧 Setting up AI contribution columns in database...\n');
  
  try {
    // Try to add the columns using a direct SQL execution
    // Note: This will only work if the service key has the right permissions
    // Otherwise, we'll catch the error and continue
    console.log('📝 Attempting to add AI contribution columns...');
    
    // We'll update one module first to test if columns exist
    const { error: testError } = await supabase
      .from('system_modules')
      .update({
        ai_level: 'none'
      })
      .eq('name', 'companies');
    
    if (testError && testError.message.includes('ai_level')) {
      console.log('❌ AI columns do not exist in database.');
      console.log('📋 Please run the following SQL in your Supabase dashboard:');
      console.log('\n' + '='.repeat(80));
      console.log(`
-- Add AI contribution fields to system_modules table
ALTER TABLE public.system_modules 
ADD COLUMN IF NOT EXISTS ai_capabilities TEXT[] DEFAULT '{}';

ALTER TABLE public.system_modules 
ADD COLUMN IF NOT EXISTS ai_level TEXT DEFAULT 'none' CHECK (ai_level IN ('high', 'medium', 'low', 'none'));

ALTER TABLE public.system_modules 
ADD COLUMN IF NOT EXISTS ai_description TEXT;

ALTER TABLE public.system_modules 
ADD COLUMN IF NOT EXISTS ai_features JSONB DEFAULT '{}';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_system_modules_ai_level ON public.system_modules(ai_level);
CREATE INDEX IF NOT EXISTS idx_system_modules_ai_capabilities ON public.system_modules USING GIN(ai_capabilities);
      `);
      console.log('='.repeat(80) + '\n');
      console.log('❌ Cannot proceed without database schema update.');
      return false;
    }
    
    console.log('✅ AI contribution columns are ready!\n');
    return true;
    
  } catch (error) {
    console.error('❌ Error setting up columns:', error);
    return false;
  }
}

async function addAIContributionToModules() {
  try {
    console.log('🤖 Adding AI contribution information to modules...\n');
    
    // Get all business modules
    const { data: modules, error } = await supabase
      .from('system_modules')
      .select('name, category, type, maturity_status')
      .eq('type', 'business')
      .eq('is_active', true);
    
    if (error) {
      console.error('❌ Error fetching modules:', error);
      return;
    }
    
    console.log(`📊 Found ${modules.length} business modules to update\n`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const module of modules) {
      const aiContribution = AI_CONTRIBUTIONS[module.name as keyof typeof AI_CONTRIBUTIONS];
      
      if (aiContribution) {
        // Update the module with AI contribution information
        const { error: updateError } = await supabase
          .from('system_modules')
          .update({
            ai_capabilities: aiContribution.ai_capabilities,
            ai_level: aiContribution.ai_level,
            ai_description: aiContribution.ai_description,
            ai_features: aiContribution.ai_features
          })
          .eq('name', module.name);
        
        if (updateError) {
          console.error(`❌ Error updating ${module.name}:`, updateError);
          skippedCount++;
        } else {
          console.log(`✅ Updated ${module.name} with AI level: ${aiContribution.ai_level} (${aiContribution.ai_capabilities.length} capabilities)`);
          updatedCount++;
        }
      } else {
        console.log(`⚠️  No AI contribution defined for: ${module.name}`);
        // Set to 'none' for modules without AI contribution
        const { error: updateError } = await supabase
          .from('system_modules')
          .update({
            ai_level: 'none',
            ai_capabilities: [],
            ai_description: null,
            ai_features: {}
          })
          .eq('name', module.name);
        
        if (updateError) {
          console.error(`❌ Error updating ${module.name} to 'none':`, updateError);
        }
        skippedCount++;
      }
      
      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\n🎉 AI Contribution Update Complete!`);
    console.log(`✅ Successfully updated: ${updatedCount} modules`);
    console.log(`⚠️  Skipped: ${skippedCount} modules`);
    
    // Summary by AI level
    console.log(`\n📈 AI INTEGRATION SUMMARY:`);
    const aiLevelCounts = {
      high: Object.values(AI_CONTRIBUTIONS).filter(ai => ai.ai_level === 'high').length,
      medium: Object.values(AI_CONTRIBUTIONS).filter(ai => ai.ai_level === 'medium').length,
      low: Object.values(AI_CONTRIBUTIONS).filter(ai => ai.ai_level === 'low').length
    };
    
    console.log(`🔥 High AI Integration: ${aiLevelCounts.high} modules`);
    console.log(`⚡ Medium AI Integration: ${aiLevelCounts.medium} modules`);
    console.log(`💡 Low AI Integration: ${aiLevelCounts.low} modules`);
    
    console.log(`\n🔄 Please refresh your browser to see AI contribution information in module cards!`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the setup and application
async function main() {
  const columnsReady = await setupDatabaseColumns();
  if (columnsReady) {
    await addAIContributionToModules();
  }
}

main(); 