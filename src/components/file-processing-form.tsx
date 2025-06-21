
"use client";

import { useState, useEffect, useRef } from "react";
import { useActionState } from "react";
import { initiateCreditProcessingAction } from "@/lib/actions/ai";
import type { ProcessCreditReportResult } from "@/lib/schemas/ai-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, FileText, Lightbulb, AlertCircle, CheckCircle, ScanSearch, Workflow, Settings } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const initialServerState: ProcessCreditReportResult | null = null;

export function FileProcessingForm() {
  const [serverState, formAction, isPending] = useActionState(initiateCreditProcessingAction, initialServerState);
  const [displayResult, setDisplayResult] = useState<ProcessCreditReportResult | null>(null);
  
  const identifierInputRef = useRef<HTMLInputElement>(null);
  const userInformationInputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);


  useEffect(() => {
    if (serverState) {
      setDisplayResult(serverState);
    }
  }, [serverState]);
  
  const handleReset = () => {
    formRef.current?.reset(); // Resets all form fields to their default values
    if (identifierInputRef.current) {
      identifierInputRef.current.value = ""; 
    }
    if (userInformationInputRef.current) {
      userInformationInputRef.current.value = ""; 
    }
    setDisplayResult(null); 
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <ScanSearch className="h-6 w-6 text-primary" />
            <CardTitle>Initiate Credit Report Processing</CardTitle>
          </div>
          <CardDescription>
            Enter your unique identifier (e.g., Social Credit Number, SSN, or other system ID).
            Mooney will securely fetch and process your credit report (simulated fetch) to provide analysis and suggestions.
            All data is handled securely. Choose your processing channel.
          </CardDescription>
        </CardHeader>
        <form action={formAction} ref={formRef}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="identifier">Social Credit Number / Identifier</Label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                ref={identifierInputRef}
                placeholder="Enter your identifier"
                required
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userInformation">Additional Information (Optional)</Label>
              <Textarea
                id="userInformation"
                name="userInformation"
                ref={userInformationInputRef}
                placeholder="E.g., specific accounts you are concerned about, personal circumstances, etc."
                rows={3}
                disabled={isPending}
              />
            </div>

            <div className="space-y-3">
              <Label>Jurisdiction</Label>
              <RadioGroup defaultValue="US" name="jurisdiction" disabled={isPending} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="US" id="jurisdiction-us" />
                  <Label htmlFor="jurisdiction-us" className="font-normal">US</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="UK" id="jurisdiction-uk" />
                  <Label htmlFor="jurisdiction-uk" className="font-normal">UK</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Processing Channel</Label>
              <RadioGroup defaultValue="internal" name="processingChannel" disabled={isPending} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="internal" id="channel-internal" />
                  <Label htmlFor="channel-internal" className="font-normal flex items-center"><Settings className="mr-2 h-4 w-4 text-blue-500"/>Internal Genkit Flows</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="external" id="channel-external" />
                  <Label htmlFor="channel-external" className="font-normal flex items-center"><Workflow className="mr-2 h-4 w-4 text-purple-500"/>External Python/LangGraph (Simulated Call)</Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground">
                'External' simulates offloading to a Python service; results would arrive via callbacks (not fully shown in UI for this demo).
              </p>
            </div>

          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={handleReset} disabled={isPending}>
              Reset
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Process Report
            </Button>
          </CardFooter>
        </form>
      </Card>

      {isPending && !displayResult && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Processing your report...</p>
        </div>
      )}
      
      {displayResult?.statusMessage && (
         <Alert variant="default" className={`shadow-md ${displayResult.error ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-700' : 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700'}`}>
          {displayResult.error ? <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" /> : <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
          <AlertTitle className={`${displayResult.error ? 'text-yellow-700 dark:text-yellow-300' : 'text-blue-700 dark:text-blue-300'}`}>Processing Status</AlertTitle>
          <AlertDescription className={`${displayResult.error ? 'text-yellow-600 dark:text-yellow-400' : 'text-blue-600 dark:text-blue-400'}`}>
            {displayResult.statusMessage}
          </AlertDescription>
        </Alert>
      )}


      {displayResult?.error && !displayResult.statusMessage && ( /* Only show generic error if no status message provided */
        <Alert variant="destructive" className="shadow-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Processing Report</AlertTitle>
          <AlertDescription>{displayResult.error}</AlertDescription>
        </Alert>
      )}


      {displayResult?.summary && (
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <CardTitle>Credit Report Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4 whitespace-pre-wrap bg-muted/30">
              {displayResult.summary.summary}
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {displayResult?.disputeLetters && displayResult.disputeLetters.disputeLetters.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-6 w-6 text-primary" />
              <CardTitle>Suggested Dispute Letters</CardTitle>
            </div>
            <CardDescription>
              Based on the analysis, here are suggested dispute letters. Review and customize them before sending.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {displayResult.disputeLetters.disputeLetters.map((letter, index) => (
              <details key={index} className="group rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
                <summary className="flex cursor-pointer items-center justify-between font-medium text-primary group-hover:text-accent">
                  Dispute Letter Suggestion {index + 1}
                  <span className="transform transition-transform duration-200 group-open:rotate-180">▼</span>
                </summary>
                <ScrollArea className="mt-3 h-[300px] w-full rounded-md border p-3 whitespace-pre-wrap bg-muted/30">
                  {letter}
                </ScrollArea>
              </details>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
