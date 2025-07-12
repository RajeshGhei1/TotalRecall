
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAIEmailResponse, EmailContext, AIEmailResponse } from '@/hooks/email/useAIEmailResponse';
import { Bot, Send, RefreshCw, Lightbulb } from 'lucide-react';

interface AIEmailResponseGeneratorProps {
  emailContext: EmailContext;
  onResponseGenerated?: (response: string) => void;
}

export const AIEmailResponseGenerator: React.FC<AIEmailResponseGeneratorProps> = ({
  emailContext,
  onResponseGenerated
}) => {
  const [responseInstructions, setResponseInstructions] = useState('');
  const [generatedResponse, setGeneratedResponse] = useState<AIEmailResponse | null>(null);
  const [selectedTone, setSelectedTone] = useState<'professional' | 'friendly' | 'formal'>('professional');
  const [improvementRequest, setImprovementRequest] = useState('');
  
  const { generateEmailResponse, improveEmailResponse, isGenerating } = useAIEmailResponse();

  const handleGenerateResponse = async () => {
    const response = await generateEmailResponse(emailContext, responseInstructions);
    if (response) {
      setGeneratedResponse(response);
    }
  };

  const handleImproveResponse = async () => {
    if (!generatedResponse || !improvementRequest.trim()) return;
    
    const improvedResponse = await improveEmailResponse(generatedResponse.response, improvementRequest);
    if (improvedResponse) {
      setGeneratedResponse({
        ...generatedResponse,
        response: improvedResponse
      });
      setImprovementRequest('');
    }
  };

  const handleUseResponse = () => {
    if (generatedResponse && onResponseGenerated) {
      onResponseGenerated(generatedResponse.response);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Email Response Generator
          </CardTitle>
          <CardDescription>
            Generate intelligent email responses using AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Original Email Context */}
          <div className="bg-gray-50 p-3 rounded-md">
            <h4 className="font-medium text-sm mb-2">Responding to:</h4>
            <div className="space-y-1 text-sm">
              <p><strong>From:</strong> {emailContext.sender}</p>
              <p><strong>Subject:</strong> {emailContext.subject}</p>
              <p><strong>Urgency:</strong> 
                <Badge variant={emailContext.urgency === 'high' ? 'destructive' : 'outline'} className="ml-2">
                  {emailContext.urgency}
                </Badge>
              </p>
            </div>
          </div>

          {/* Response Instructions */}
          <div>
            <label className="text-sm font-medium">Response Instructions (Optional)</label>
            <Textarea
              placeholder="e.g., Be apologetic, offer a solution, schedule a meeting..."
              value={responseInstructions}
              onChange={(e) => setResponseInstructions(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Tone Selection */}
          <div>
            <label className="text-sm font-medium">Preferred Tone</label>
            <Select value={selectedTone} onValueChange={(value: unknown) => setSelectedTone(value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleGenerateResponse} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating AI Response...
              </>
            ) : (
              <>
                <Bot className="h-4 w-4 mr-2" />
                Generate AI Response
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Response */}
      {generatedResponse && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              AI Generated Response
              <Badge variant="outline">
                Confidence: {(generatedResponse.confidence * 100).toFixed(0)}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={generatedResponse.response}
              onChange={(e) => setGeneratedResponse({
                ...generatedResponse,
                response: e.target.value
              })}
              className="min-h-[200px]"
              placeholder="AI generated response will appear here..."
            />

            {/* AI Suggestions */}
            {generatedResponse.suggestions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4" />
                  AI Suggestions
                </h4>
                <ul className="space-y-1">
                  {generatedResponse.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvement Request */}
            <div>
              <label className="text-sm font-medium">Request Improvements</label>
              <div className="flex gap-2 mt-1">
                <Textarea
                  placeholder="e.g., Make it more concise, add a call-to-action..."
                  value={improvementRequest}
                  onChange={(e) => setImprovementRequest(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleImproveResponse}
                  disabled={!improvementRequest.trim() || isGenerating}
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleUseResponse} className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Use This Response
              </Button>
              <Button 
                onClick={handleGenerateResponse} 
                variant="outline"
                disabled={isGenerating}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
