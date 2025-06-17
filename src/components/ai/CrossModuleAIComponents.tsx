
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useUnifiedAI } from '@/hooks/ai/useUnifiedAI';
import { Mail, FormInput, FileText, TrendingUp, Lightbulb } from 'lucide-react';

interface AIEmailResponseGeneratorProps {
  emailContent: string;
  onResponseGenerated: (response: string) => void;
  userId: string;
  tenantId?: string;
  module: string;
}

export const AIEmailResponseGenerator: React.FC<AIEmailResponseGeneratorProps> = ({
  emailContent,
  onResponseGenerated,
  userId,
  tenantId,
  module
}) => {
  const { generateEmailResponse, isLoading } = useUnifiedAI();
  const [responseType, setResponseType] = useState('reply');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');

  const handleGenerate = async () => {
    const response = await generateEmailResponse(emailContent, responseType, {
      tone,
      length,
      userId,
      tenantId,
      module
    });

    if (response?.success) {
      onResponseGenerated(response.data.responseText);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          AI Email Response Generator
        </CardTitle>
        <CardDescription>
          Generate intelligent email responses with AI assistance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="responseType">Response Type</Label>
            <select
              id="responseType"
              className="w-full p-2 border rounded-md"
              value={responseType}
              onChange={(e) => setResponseType(e.target.value)}
            >
              <option value="reply">Reply</option>
              <option value="forward">Forward</option>
              <option value="follow_up">Follow Up</option>
              <option value="acknowledgment">Acknowledgment</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <select
              id="tone"
              className="w-full p-2 border rounded-md"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="length">Length</Label>
            <select
              id="length"
              className="w-full p-2 border rounded-md"
              value={length}
              onChange={(e) => setLength(e.target.value)}
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isLoading || !emailContent}
          className="w-full"
        >
          {isLoading ? 'Generating...' : 'Generate Response'}
        </Button>
      </CardContent>
    </Card>
  );
};

interface SmartFormFieldProps {
  fieldName: string;
  fieldType: string;
  formType: string;
  value: string;
  onChange: (value: string) => void;
  userId: string;
  tenantId?: string;
  module: string;
}

export const SmartFormField: React.FC<SmartFormFieldProps> = ({
  fieldName,
  fieldType,
  formType,
  value,
  onChange,
  userId,
  tenantId,
  module
}) => {
  const { getFormSuggestions, isLoading } = useUnifiedAI();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleGetSuggestions = async () => {
    const response = await getFormSuggestions(formType, fieldName, value, {
      userId,
      tenantId,
      module
    });

    if (response?.success) {
      setSuggestions(response.data.suggestions || []);
      setShowSuggestions(true);
    }
  };

  const applySuggestion = (suggestionValue: string) => {
    onChange(suggestionValue);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={fieldName}>{fieldName}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleGetSuggestions}
          disabled={isLoading}
        >
          <Lightbulb className="h-3 w-3 mr-1" />
          AI Suggest
        </Button>
      </div>

      {fieldType === 'textarea' ? (
        <Textarea
          id={fieldName}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Input
          id={fieldName}
          type={fieldType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {showSuggestions && suggestions.length > 0 && (
        <Card className="mt-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FormInput className="h-4 w-4" />
              Smart Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-gray-50"
                onClick={() => applySuggestion(suggestion.value)}
              >
                <div>
                  <span className="text-sm font-medium">{suggestion.value}</span>
                  <p className="text-xs text-muted-foreground">{suggestion.reasoning}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {Math.round(suggestion.confidence * 100)}%
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface ContentAnalysisWidgetProps {
  content: string;
  userId: string;
  tenantId?: string;
  module: string;
}

export const ContentAnalysisWidget: React.FC<ContentAnalysisWidgetProps> = ({
  content,
  userId,
  tenantId,
  module
}) => {
  const { analyzeContent, isLoading } = useUnifiedAI();
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = async () => {
    const response = await analyzeContent(content, {
      userId,
      tenantId,
      module
    });

    if (response?.success) {
      setAnalysis(response.data.analysis);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Content Analysis
        </CardTitle>
        <CardDescription>
          AI-powered content analysis and insights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleAnalyze}
          disabled={isLoading || !content}
          className="w-full"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Content'}
        </Button>

        {analysis && (
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">Sentiment</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    variant={analysis.sentiment.label === 'positive' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {analysis.sentiment.label}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(analysis.sentiment.score * 100)}%
                  </span>
                </div>
              </div>

              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">Readability</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">
                    {analysis.readabilityScore}/100
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {analysis.wordCount} words
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2">Keywords</h4>
              <div className="flex flex-wrap gap-1">
                {analysis.keywords.map((keyword: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2">Topics</h4>
              <div className="flex flex-wrap gap-1">
                {analysis.topics.map((topic: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface PredictiveInsightsWidgetProps {
  dataType: string;
  historicalData: any[];
  userId: string;
  tenantId?: string;
  module: string;
}

export const PredictiveInsightsWidget: React.FC<PredictiveInsightsWidgetProps> = ({
  dataType,
  historicalData,
  userId,
  tenantId,
  module
}) => {
  const { predictOutcome, isLoading } = useUnifiedAI();
  const [prediction, setPrediction] = useState<any>(null);

  const handlePredict = async () => {
    const response = await predictOutcome(dataType, historicalData, {
      userId,
      tenantId,
      module
    });

    if (response?.success) {
      setPrediction(response.data.prediction);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Predictive Insights
        </CardTitle>
        <CardDescription>
          AI-powered predictions and recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handlePredict}
          disabled={isLoading || !historicalData.length}
          className="w-full"
        >
          {isLoading ? 'Generating Predictions...' : 'Generate Insights'}
        </Button>

        {prediction && (
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-sm">Prediction</h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="default" className="capitalize">
                  {prediction.outcome.replace('_', ' ')}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {Math.round(prediction.probability * 100)}% probability
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Timeframe: {prediction.timeframe}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2">Key Factors</h4>
              <div className="flex flex-wrap gap-1">
                {prediction.factors.map((factor: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {factor}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
