
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ModuleLimitsEditorProps {
  limits: Record<string, any>;
  onLimitsChange: (limits: Record<string, any>) => void;
  category: string;
}

const ModuleLimitsEditor: React.FC<ModuleLimitsEditorProps> = ({
  limits,
  onLimitsChange,
  category
}) => {
  const [limitsJson, setLimitsJson] = useState(JSON.stringify(limits, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  const limitTemplates = {
    analytics: {
      ai_analysis_requests_per_month: 1000,
      talent_profiles_analyzed: 500,
      reports_generated_per_month: 50,
      data_export_limit_mb: 100,
      concurrent_analysis_jobs: 5
    },
    communication: {
      emails_per_month: 5000,
      sms_messages_per_month: 1000,
      video_calls_minutes_per_month: 2000,
      file_attachments_mb_per_month: 500
    },
    integrations: {
      api_calls_per_hour: 1000,
      webhook_endpoints: 10,
      data_sync_frequency_minutes: 15,
      external_connections: 5
    },
    core: {
      users_limit: 100,
      storage_limit_gb: 10,
      backup_retention_days: 30,
      audit_log_retention_days: 90
    },
    recruitment: {
      job_postings_per_month: 50,
      candidate_profiles: 1000,
      interview_scheduling_per_month: 200,
      resume_parsing_per_month: 500
    },
    talent: {
      talent_profiles: 500,
      skill_assessments_per_month: 100,
      career_recommendations_per_month: 200,
      performance_reviews_per_year: 50
    }
  };

  const applyTemplate = (templateKey: string) => {
    const template = limitTemplates[templateKey as keyof typeof limitTemplates] || {};
    setLimitsJson(JSON.stringify(template, null, 2));
    onLimitsChange(template);
    setJsonError(null);
  };

  const handleJsonChange = (value: string) => {
    setLimitsJson(value);
    try {
      const parsed = JSON.parse(value);
      onLimitsChange(parsed);
      setJsonError(null);
    } catch (error) {
      setJsonError('Invalid JSON format');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Default Resource Limits</Label>
        <p className="text-xs text-muted-foreground mb-2">
          Define usage limits and quotas for this module
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Quick Templates</CardTitle>
          <CardDescription>
            Apply predefined limits based on module type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {Object.keys(limitTemplates).map((templateKey) => (
              <Button
                key={templateKey}
                variant="outline"
                size="sm"
                onClick={() => applyTemplate(templateKey)}
                className="capitalize"
              >
                {templateKey}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label htmlFor="limits-json">Limits Configuration (JSON)</Label>
        <Textarea
          id="limits-json"
          value={limitsJson}
          onChange={(e) => handleJsonChange(e.target.value)}
          placeholder='{\n  "api_calls_per_hour": 1000,\n  "storage_limit_gb": 10\n}'
          className="font-mono text-sm min-h-32"
        />
        {jsonError && (
          <p className="text-sm text-red-500">{jsonError}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Define resource limits as key-value pairs. These will be used as default limits for subscription plans.
        </p>
      </div>

      {Object.keys(limits).length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Current Limits Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(limits).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b pb-1">
                  <span className="text-muted-foreground">{key}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ModuleLimitsEditor;
