"use client"

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Info } from "lucide-react";
import { adminVisitorInsightSummary, AdminVisitorInsightSummaryInput } from "@/ai/flows/admin-visitor-insight-summary";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AIInsights(props: AdminVisitorInsightSummaryInput) {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateInsight = async () => {
    setLoading(true);
    try {
      const result = await adminVisitorInsightSummary(props);
      setInsight(result.summary);
    } catch (error) {
      console.error("AI Insight failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Optionally auto-generate or wait for button click
  }, [props]);

  return (
    <Card className="border-accent/20 bg-accent/5 overflow-hidden">
      <CardHeader className="bg-accent/10 border-b border-accent/10 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <CardTitle className="font-headline text-xl text-primary">AI Usage Insights</CardTitle>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="border-accent text-accent hover:bg-accent/10"
          onClick={generateInsight}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
          {insight ? 'Regenerate Analysis' : 'Analyze Current Data'}
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        {insight ? (
          <div className="prose prose-sm max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
            {insight}
          </div>
        ) : (
          <div className="text-center py-8">
            <Info className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-body">
              Click the analyze button above to generate a summary of current visitor patterns using AI.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
