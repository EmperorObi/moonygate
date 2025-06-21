
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Settings, Zap, UserCheck, FileSearch, Bot, CloudCog, ArrowRightLeft, Webhook, DatabaseZap, Cog, FileText, ServerCog, Terminal, Info, AlertTriangle as AlertTriangleIcon, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePageLoading } from '@/contexts/loading-context';
import { useToast } from "@/hooks/use-toast";

export default function AiOrchestrationPage() {
  const router = useRouter();
  const { startRouteTransition } = usePageLoading();
  const { toast } = useToast();

  const handleRunMainOrchestration = () => {
    startRouteTransition();
    router.push('/file-processing');
  };

  const handleConfigureClick = (workflowName: string) => {
    toast({
      title: "Configuration Information",
      description: `Configuration for "${workflowName}" is primarily handled server-side (e.g., Genkit flow definitions, AI model selection in prompts) or via environment variables. Direct UI configuration is not available here.`,
      variant: "default",
    });
  };

  const workflows = [
    { 
      id: "wf_orchestrator", 
      name: "Main Orchestration Engine: Credit Processing", 
      description: "The primary flow that coordinates all steps, whether internal or external, based on user input from 'File Processing'.", 
      status: "Active", 
      lastRun: "N/A", 
      icon: Cog, 
      onClickRunManually: handleRunMainOrchestration, 
      runManuallyEnabled: true,
      onClickConfigure: () => handleConfigureClick("Main Orchestration Engine: Credit Processing"),
      configureManuallyEnabled: true,
    },
    { 
      id: "wf_summary_internal", 
      name: "AI Model: Credit Report Summarization (Internal Path)", 
      description: "Generates a concise summary of the credit report. Invoked by the Orchestration Engine if 'Internal Genkit Flows' channel is selected.", 
      status: "Active", 
      lastRun: "N/A", 
      icon: Bot,
      runManuallyEnabled: false,
      onClickConfigure: () => handleConfigureClick("AI Model: Credit Report Summarization (Internal Path)"),
      configureManuallyEnabled: true,
    },
    { 
      id: "wf_dispute_internal", 
      name: "AI Model: Dispute Letter Suggestion (Internal Path)", 
      description: "Suggests dispute letters based on report analysis. Invoked by the Orchestration Engine if 'Internal Genkit Flows' channel is selected.", 
      status: "Active", 
      lastRun: "N/A", 
      icon: Bot,
      runManuallyEnabled: false,
      onClickConfigure: () => handleConfigureClick("AI Model: Dispute Letter Suggestion (Internal Path)"),
      configureManuallyEnabled: true,
    },
    { 
      id: "wf_external_python", 
      name: "External AI Agent: Python/LangGraph (Simulated)", 
      description: "Represents the offloading of analysis and dispute generation to a Python-based microservice using LangGraph.", 
      status: "Active (Simulated)", 
      lastRun: "N/A", 
      icon: CloudCog,
      runManuallyEnabled: false,
      onClickConfigure: () => handleConfigureClick("External AI Agent: Python/LangGraph (Simulated)"),
      configureManuallyEnabled: true,
    },
    { 
      id: "wf_monitoring", 
      name: "Credit Score Monitoring (Future)", 
      description: "Monitors changes in credit score and alerts user.", 
      status: "Inactive", 
      lastRun: "N/A", 
      icon: Zap,
      runManuallyEnabled: false,
      configureManuallyEnabled: false,
    },
  ];

  const mockEngineLogs = [
    { timestamp: "2024-07-30 10:05:15", level: "INFO", message: "Orchestration Engine initialized and ready.", icon: Info },
    { timestamp: "2024-07-30 10:10:22", level: "INFO", message: "Processing request for report ID: RPT-INT-001 (Channel: Internal, Jurisdiction: US)", icon: Info },
    { timestamp: "2024-07-30 10:10:25", level: "INFO", message: "Internal: Summarization complete for RPT-INT-001.", icon: Bot },
    { timestamp: "2024-07-30 10:10:30", level: "INFO", message: "Internal: Dispute letter generation complete for RPT-INT-001.", icon: Bot },
    { timestamp: "2024-07-30 10:10:31", level: "INFO", message: "Internal: Processing successful for RPT-INT-001.", icon: CheckCircle },
    { timestamp: "2024-07-30 10:12:45", level: "INFO", message: "Processing request for report ID: RPT-EXT-002 (Channel: External, Jurisdiction: UK)", icon: Info },
    { timestamp: "2024-07-30 10:12:46", level: "INFO", message: "External: Handoff to Python service initiated for RPT-EXT-002. Awaiting callback.", icon: CloudCog },
    { timestamp: "2024-07-30 10:13:55", level: "WARN", message: "External: Callback received for RPT-EXT-002. Status: SUCCESS. Processing time: 69s.", icon: Webhook },
  ];


  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>AI Workflow Orchestration</CardTitle>
          <CardDescription>
            Overview of how Mooney's AI processes credit reports. The primary orchestration is triggered
            from the "File Processing" page by providing an identifier and choosing a processing channel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section describes the automated sequences of actions performed by the AI. The "Main Orchestration Engine"
            directs the workflow based on whether "Internal Genkit Flows" or "External Python/LangGraph" is selected.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <ServerCog className="h-7 w-7 text-primary" />
            <div>
              <CardTitle>Orchestration Engine Activity (Examples)</CardTitle>
              <CardDescription>A conceptual feed of recent engine activities and statuses.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {mockEngineLogs.map((log, index) => (
              <div key={index} className="flex items-start space-x-3 p-2 rounded-md bg-muted/50 border border-muted">
                <log.icon className={`h-5 w-5 mt-0.5 ${log.level === "INFO" ? "text-blue-500" : log.level === "WARN" ? "text-yellow-500" : "text-red-500"}`} />
                <div>
                  <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                  <p className="text-sm">
                    <span className={`font-semibold ${log.level === "INFO" ? "text-blue-600" : log.level === "WARN" ? "text-yellow-600" : "text-red-600"}`}>
                      [{log.level}]
                    </span> {log.message}
                  </p>
                </div>
              </div>
            ))}
             <div className="flex items-center space-x-3 p-2">
                <Terminal className="h-5 w-5 mt-0.5 text-gray-400"/>
                 <div>
                    <p className="text-sm text-muted-foreground italic">Engine currently idle. Waiting for new tasks...</p>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>


      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workflows.map((flow) => (
          <Card key={flow.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{flow.name}</CardTitle>
                <flow.icon className="h-6 w-6 text-primary" />
              </div>
              <CardDescription>{flow.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center space-x-2 mb-3">
                <span className={`px-2 py-0.5 text-xs rounded-full ${flow.status.startsWith("Active") ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                  {flow.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Last Run: {flow.lastRun}</p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={!flow.configureManuallyEnabled}
                onClick={flow.onClickConfigure}
              >
                <Settings className="mr-2 h-4 w-4" /> Configure
              </Button>
              <Button
                size="sm"
                disabled={!flow.runManuallyEnabled}
                onClick={flow.onClickRunManually}
              >
                <PlayCircle className="mr-2 h-4 w-4" /> Run Manually
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Conceptual Orchestration Logic</CardTitle>
          <CardDescription>A step-by-step breakdown of how the AI orchestration works.</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start space-x-2">
                <UserCheck className="h-4 w-4 text-primary mt-1 shrink-0"/>
                <span>User provides an identifier, jurisdiction, and chooses a <strong className="text-foreground">Processing Channel</strong> (Internal Genkit or External Python) via the 'File Processing' page.</span>
            </li>
            <li className="flex items-start space-x-2">
                <FileSearch className="h-4 w-4 text-primary mt-1 shrink-0"/>
                <span>System invokes the <code className="text-xs bg-muted px-1 py-0.5 rounded">initiateCreditProcessingAction</code> server action.</span>
            </li>
            <li className="flex items-start space-x-2">
                <Cog className="h-4 w-4 text-primary mt-1 shrink-0"/>
                <span>
                    The <code className="text-xs bg-muted px-1 py-0.5 rounded">fetchAndProcessCreditReport</code> Genkit flow (Main Orchestration Engine) is called.
                    It then proceeds based on the selected <strong className="text-foreground">Processing Channel</strong>:
                </span>
            </li>
          </ol>

          <div className="mt-4 space-y-6 pl-5">
            {/* Internal Processing Path */}
            <div>
                <div className="flex items-center space-x-2 mb-2">
                    <Settings className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-md text-foreground">IF Internal Genkit Flows Channel Selected:</h4>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground pl-6">
                    <li className="flex items-start space-x-2">
                        <FileText className="h-4 w-4 text-primary mt-1 shrink-0"/>
                        <span>Simulate fetching the credit report data.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                        <Bot className="h-4 w-4 text-primary mt-1 shrink-0"/>
                        <span>Call <code className="text-xs bg-muted px-1 py-0.5 rounded">summarizeCreditReport</code> AI flow with fetched data.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                        <Bot className="h-4 w-4 text-primary mt-1 shrink-0"/>
                        <span>Call <code className="text-xs bg-muted px-1 py-0.5 rounded">suggestDisputeLetters</code> AI flow with fetched data and user information.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                        <Zap className="h-4 w-4 text-primary mt-1 shrink-0"/>
                        <span>Results (summary and letters, or error) are returned directly to the user interface.</span>
                    </li>
                </ol>
            </div>

            {/* External Processing Path */}
            <div>
                <div className="flex items-center space-x-2 mb-2">
                    <CloudCog className="h-5 w-5 text-purple-600" />
                    <h4 className="font-semibold text-md text-foreground">IF External Python/LangGraph Channel Selected:</h4>
                </div>
                 <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground pl-6">
                    <li className="flex items-start space-x-2">
                        <ArrowRightLeft className="h-4 w-4 text-primary mt-1 shrink-0"/>
                        <span>Gateway prepares a payload (reportId, userId, identifier, jurisdiction) and logs intent to call the external Python AI service endpoint (e.g., <code className="text-xs bg-muted px-1 py-0.5 rounded">/analyze_and_dispute</code>).</span>
                    </li>
                    <li className="flex items-start space-x-2">
                        <DatabaseZap className="h-4 w-4 text-primary mt-1 shrink-0"/>
                        <span>Gateway updates Firestore: status set to <code className="text-xs bg-muted px-1 py-0.5 rounded">PROCESSING_EXTERNAL_INITIATED</code> for the <code className="text-xs bg-muted px-1 py-0.5 rounded">reportId</code>.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                        <Zap className="h-4 w-4 text-primary mt-1 shrink-0"/>
                        <span>Gateway returns an immediate status message to the UI (e.g., "External processing initiated...").</span>
                    </li>
                    <li className="flex items-start space-x-2">
                        <Webhook className="h-4 w-4 text-primary mt-1 shrink-0"/>
                        <span>(Simulation) The external Python service asynchronously processes the report, then calls back to the Gateway's <code className="text-xs bg-muted px-1 py-0.5 rounded">/api/ai/callbacks/analysis-complete</code> endpoint with the results.</span>
                    </li>
                     <li className="flex items-start space-x-2">
                        <DatabaseZap className="h-4 w-4 text-primary mt-1 shrink-0"/>
                        <span>The Gateway callback updates Firestore with the received summary, dispute letters, and final status (e.g., <code className="text-xs bg-muted px-1 py-0.5 rounded">SUCCESS_EXTERNAL_ANALYSIS_COMPLETE</code>).</span>
                    </li>
                     <li className="flex items-start space-x-2">
                        <Zap className="h-4 w-4 text-primary mt-1 shrink-0"/>
                        <span>UI (conceptually) reflects results based on Firestore updates.</span>
                    </li>
                </ol>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
             <p className="font-semibold text-md text-foreground mb-2">Future Considerations:</p>
             <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>If errors occur, specific error handling and retry logic could be implemented within each path.</li>
                <li>Notifications could be sent upon completion or failure of key orchestration steps.</li>
                <li>(Further Future) AI agents could autonomously act on dispute letters with minimal user interaction (e.g., sending to bureaus after review), involving more complex orchestration and tracking.</li>
             </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

