
'use server';
/**
 * @fileOverview Fetches (simulated) and processes a credit report based on a user identifier.
 * Supports internal Genkit processing or simulating an external call to a Python/LangGraph service.
 *
 * - fetchAndProcessCreditReport - Main function to orchestrate fetching and AI analysis.
 * - FetchAndProcessCreditReportInput - Input type for the main function.
 * - FetchAndProcessCreditReportOutput - Output type for the main function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { v4 as uuidv4 } from 'uuid';
import { Timestamp } from 'firebase-admin/firestore';
import { getFirebaseAdminDb } from '@/lib/firebase/firebaseAdmin';
import type { AnalysisCompleteCallbackInput } from '@/app/api/ai/callbacks/analysis-complete/route';

import {
  summarizeCreditReport,
  type SummarizeCreditReportOutput,
} from '@/ai/flows/summarize-credit-report';
import {
  suggestDisputeLetters,
  type SuggestDisputeLettersInput,
  type SuggestDisputeLettersOutput,
} from '@/ai/flows/suggest-dispute-letters';

const FetchAndProcessCreditReportInputSchema = z.object({
  identifier: z.string().describe('The user-provided identifier (e.g., Social Credit Number, SSN, etc.).'),
  userInformation: z.string().optional().describe('Any relevant user information that could help personalize the dispute letters.'),
  jurisdiction: z.enum(['US', 'UK']).default('US').optional()
    .describe('The jurisdiction for which to tailor dispute strategies and letters (US or UK). Defaults to US if not provided.'),
  processingChannel: z.enum(['internal', 'external']).default('internal').optional()
    .describe("The processing channel: 'internal' for Genkit flows, 'external' to simulate calling an external Python/LangGraph service. Defaults to 'internal'."),
  userId: z.string().optional().describe("The authenticated user's ID, if available."),
});

export type FetchAndProcessCreditReportInput = z.infer<typeof FetchAndProcessCreditReportInputSchema>;

const FetchAndProcessCreditReportOutputSchema = z.object({
  summary: z.object({ summary: z.string() }).optional(),
  disputeLetters: z.object({ disputeLetters: z.array(z.string()) }).optional(),
  error: z.string().optional(),
  statusMessage: z.string().optional().describe("A message indicating the status of processing, especially for external calls."),
  reportId: z.string().optional().describe("The unique ID for this report processing instance, especially for external calls."),
  processingChannel: z.enum(['internal', 'external']).optional(),
  jurisdiction: z.enum(['US', 'UK']).optional(),
});

export type FetchAndProcessCreditReportOutput = z.infer<typeof FetchAndProcessCreditReportOutputSchema>;

export async function fetchAndProcessCreditReport(
  input: FetchAndProcessCreditReportInput
): Promise<FetchAndProcessCreditReportOutput> {
  return fetchAndProcessCreditReportFlow(input);
}

async function simulateFetchCreditReport(identifier: string, jurisdictionParam?: 'US' | 'UK'): Promise<string> {
  const effectiveJurisdiction = jurisdictionParam || 'US';
  console.log(`Mooney Gateway: Simulating fetching credit report for identifier: ${identifier} in jurisdiction: ${effectiveJurisdiction}`);
  const dummyReportContent = `Simulated Credit Report for ${identifier} (${effectiveJurisdiction})\nAccount Holder: John Doe\nSSN/ID: ${identifier}\n\nTradeline 1: Visa Card XXXX-1234\nBalance: $500\nStatus: Paid as agreed. No issues.\n\nTradeline 2: Student Loan YYYY-5678\nBalance: $10,000\nStatus: Late payment reported on 2023-05-15 (Actual payment made 2023-05-10, bank error suspected).\n\nTradeline 3: Store Card ZZZZ-9012\nBalance: $0\nStatus: Account closed by consumer. Incorrectly reported as 'Closed by grantor'.\n\nInquiry: Mortgage Lender ABC, 2024-01-10 (Unauthorized hard inquiry)\n\nPublic Record: Bankruptcy filed 2015, Discharged 2016 (Should be removed after 7-10 years, check dates for jurisdiction ${effectiveJurisdiction}).`;
  const dummyReportDataBase64 = Buffer.from(dummyReportContent).toString('base64');
  return `data:text/plain;base64,${dummyReportDataBase64}`;
}

const fetchAndProcessCreditReportFlow = ai.defineFlow(
  {
    name: 'fetchAndProcessCreditReportFlow',
    inputSchema: FetchAndProcessCreditReportInputSchema,
    outputSchema: FetchAndProcessCreditReportOutputSchema,
  },
  async (input) => {
    const { identifier, userInformation, jurisdiction = 'US', processingChannel = 'internal', userId } = input;
    
    console.log(`Mooney Gateway (Next.js): Processing report for identifier: ${identifier} via ${processingChannel} channel in ${jurisdiction} jurisdiction. UserID: ${userId || 'N/A'}`);

    if (processingChannel === 'external') {
      const reportId = uuidv4();
      const pythonServiceEndpoint = process.env.PYTHON_AI_SERVICE_ENDPOINT_URL || 'https://your-python-ai-service.com/analyze_and_dispute'; // Aligned with Python service endpoint
      
      console.log(`Mooney Gateway (Next.js): External processing selected for identifier: ${identifier}. Report ID generated: ${reportId}. Jurisdiction: ${jurisdiction}.`);

      // 1. Construct the payload Next.js (Mooney Gateway) WOULD SEND to the Python AI service's /analyze_and_dispute endpoint
      const pythonServicePayload = {
        user_id: userId, // Align with Python service's expected 'user_id'
        report_id: reportId, // This Next.js generated reportId is used as 'report_id' for the Python service
        // The Python service might use these to fetch/correlate additional details if needed:
        original_identifier: identifier, 
        additional_user_information: userInformation, 
        jurisdiction,
        // The Python service would also need its own mechanism to fetch the actual credit report data
        // associated with `identifier` or `reportId` (e.g., from a shared data store or via another simulated fetch).
        // For this simulation, we assume the Python service has a way to get the report for `reportId`.
      };

      console.log('Mooney Gateway (Next.js): Preparing to "call" the external Python AI service by sending the following data payload via HTTP POST:');
      console.log(JSON.stringify(pythonServicePayload, null, 2));
      console.log(`Mooney Gateway (Next.js): This payload would be sent to: ${pythonServiceEndpoint}`);
      console.log('Mooney Gateway (Next.js): The external Python AI service would then use LangGraph, Google AI Python SDKs, and its own LLM prompts to perform the analysis and eventually call back to this Next.js app.');

      // In a real scenario, you would make an HTTP POST request here to `pythonServiceEndpoint`:
      // try {
      //   const externalServiceResponse = await fetch(pythonServiceEndpoint, {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json', /* 'X-Gateway-API-Key': 'YOUR_GATEWAY_TO_PYTHON_SERVICE_API_KEY' */ },
      //     body: JSON.stringify(pythonServicePayload),
      //   });
      //   if (!externalServiceResponse.ok) {
      //     const errorText = await externalServiceResponse.text();
      //     throw new Error(`External Python service responded with ${externalServiceResponse.status}: ${errorText}`);
      //   }
      //   console.log(`Mooney Gateway (Next.js): Successfully initiated processing with external Python service for report ID: ${reportId}.`);
      // } catch (e: any) {
      //   console.error(`Mooney Gateway (Next.js): Error calling external Python service for report ID ${reportId}:`, e.message);
      //   const adminDbOnError = getFirebaseAdminDb();
      //   if (adminDbOnError) {
      //       const reportRef = adminDbOnError.collection('reports').doc(reportId);
      //       await reportRef.set({
      //           reportId, identifier, userId, status: 'FAILURE_EXTERNAL_INITIATION_FAILED', 
      //           processingChannel, jurisdiction, requestedAt: Timestamp.now(),
      //           externalProcessingError: `Failed to call Python service: ${e.message}`,
      //           lastUpdatedAt: Timestamp.now(),
      //       }, { merge: true });
      //   }
      //   return { 
      //       reportId, processingChannel, jurisdiction, 
      //       error: `Failed to initiate processing with external Python service: ${e.message}`,
      //       statusMessage: `Error initiating external processing for report ID: ${reportId}.`
      //   };
      // }


      // 2. Update Firestore to indicate processing has been initiated by the gateway
      const adminDb = getFirebaseAdminDb();
      if (adminDb) {
        const reportRef = adminDb.collection('reports').doc(reportId);
        await reportRef.set({
          reportId,
          identifier,
          userId, 
          status: 'PROCESSING_EXTERNAL_INITIATED', // Status indicating gateway has sent request to Python
          requestedAt: Timestamp.now(),
          processingChannel,
          jurisdiction,
          lastUpdatedAt: Timestamp.now(),
        }, { merge: true });
      } else {
        console.error('Mooney Gateway (Next.js): Firestore Admin SDK not initialized. Cannot update report status for external processing.');
         return { 
            reportId, processingChannel, jurisdiction, 
            error: 'Firestore Admin SDK not initialized. Cannot track external processing.',
            statusMessage: `Error: Firestore Admin SDK not initialized for report ID: ${reportId}.`
        };
      }

      // 3. SIMULATE the external Python service performing its work and then calling back to THIS Next.js app
      // THIS ENTIRE setTimeout BLOCK REPRESENTS THE PYTHON SERVICE'S ASYNCHRONOUS WORK AND ITS EVENTUAL CALLBACK
      console.log(`Mooney Gateway (Next.js): Now simulating the Python AI service's asynchronous work for report ID ${reportId}... (it will call back in ~5-10 seconds)`);
      setTimeout(async () => {
        console.log(`SIMULATED PYTHON AI SERVICE (Report ID: ${reportId}): Processing complete. Preparing to call back Mooney Gateway.`);
        
        // The Python service would have used the `identifier` (passed as `original_identifier`) and `jurisdiction`
        // to fetch/process the report and generate these results.
        const simulatedSummary = `This is a detailed AI-generated summary for report ${reportId} (original identifier: ${identifier}, jurisdiction: ${jurisdiction}) processed externally by the (simulated) Python/LangGraph agent. Key issues identified: Multiple late payments. Actionable insights: Consider goodwill letters.`;
        const simulatedLetter1 = `[Simulated External Dispute Letter 1 for Report ${reportId} - ${jurisdiction}]\nTo Whom It May Concern,\nI am writing to dispute the following inaccurate information on my credit report for original identifier ${identifier}, specifically the late payment reported on Account XYZ dated 2023-01-15.\nThis was processed by the (simulated) Python agent using LangGraph and Google AI SDKs.`;
        const simulatedLetter2 = `[Simulated External Dispute Letter 2 for Report ${reportId} - ${jurisdiction}]\nDear Credit Bureau,\nPlease investigate item ABC (Account Number: ${identifier}-002) on my report. I believe this is an error because...\nThis was processed by the (simulated) Python agent using LangGraph and Google AI SDKs.`;

        const callbackPayload: AnalysisCompleteCallbackInput = {
          reportId, // This is the reportId generated by Next.js and passed to the Python service
          userId,
          status: 'SUCCESS',
          summary: simulatedSummary,
          disputeLetters: [
            { letterId: uuidv4(), content: simulatedLetter1 },
            { letterId: uuidv4(), content: simulatedLetter2 },
          ],
          timestamp: new Date().toISOString(),
        };

        const currentAdminDb = getFirebaseAdminDb(); 

        try {
          console.log(`SIMULATED PYTHON AI SERVICE (Report ID: ${reportId}): Calling back Mooney Gateway at /api/ai/callbacks/analysis-complete`);
          const appUrl = process.env.NEXT_PUBLIC_APP_URL;
          if (!appUrl) {
            console.error(`SIMULATED PYTHON AI SERVICE (Report ID: ${reportId}): NEXT_PUBLIC_APP_URL is not set. Cannot make callback.`);
            if (currentAdminDb) {
                const reportRef = currentAdminDb.collection('reports').doc(reportId);
                await reportRef.update({
                    status: 'FAILURE_EXTERNAL_CALLBACK_URL_MISSING',
                    externalProcessingError: 'NEXT_PUBLIC_APP_URL not configured for callback by Python service.',
                    lastUpdatedAt: Timestamp.now(),
                });
            }
            return;
          }
          
          const response = await fetch(`${appUrl}/api/ai/callbacks/analysis-complete`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json', 
              // 'X-Python-Service-API-Key': process.env.PYTHON_TO_GATEWAY_CALLBACK_API_KEY // TODO: Implement API Key Auth
            },
            body: JSON.stringify(callbackPayload),
          });

          if (!response.ok) {
            const errorBody = await response.text();
            console.error(`SIMULATED PYTHON AI SERVICE (Report ID: ${reportId}): Callback to Mooney Gateway failed. Status: ${response.status}, Body: ${errorBody}`);
            if (currentAdminDb) {
                const reportRef = currentAdminDb.collection('reports').doc(reportId);
                await reportRef.update({
                    status: 'FAILURE_EXTERNAL_CALLBACK_FAILED_ON_GATEWAY',
                    externalProcessingError: `Python service callback failed at Gateway with status ${response.status}: ${errorBody}`,
                    lastUpdatedAt: Timestamp.now(),
                });
            }
          } else {
            console.log(`SIMULATED PYTHON AI SERVICE (Report ID: ${reportId}): Successfully called back Mooney Gateway.`);
          }
        } catch (e: any) {
          console.error(`SIMULATED PYTHON AI SERVICE (Report ID: ${reportId}): Error during callback:`, e.message);
           if (currentAdminDb) {
                const reportRef = currentAdminDb.collection('reports').doc(reportId);
                await reportRef.update({
                    status: 'FAILURE_EXTERNAL_CALLBACK_EXCEPTION',
                    externalProcessingError: `Python service callback exception: ${e.message}`,
                    lastUpdatedAt: Timestamp.now(),
                });
            }
        }
      }, Math.random() * 5000 + 5000); // Random delay between 5-10 seconds

      // 4. Return immediate response to the client from the gateway
      return {
        reportId,
        processingChannel,
        jurisdiction,
        statusMessage: `External processing for report ID ${reportId} (Jurisdiction: ${jurisdiction}) has been initiated with the Python AI service. Results will arrive asynchronously. Check Firestore for updates.`,
      };
    }

    // Internal processing using Genkit flows
    let summaryResult: SummarizeCreditReportOutput | undefined;
    let disputeLettersResult: SuggestDisputeLettersOutput | undefined;
    const errors: string[] = [];
    let creditReportDataUri: string;

    try {
      creditReportDataUri = await simulateFetchCreditReport(identifier, jurisdiction);
      if (!creditReportDataUri) {
        throw new Error('Failed to fetch or generate credit report data.');
      }
    } catch (e: any) {
      console.error('Mooney Gateway (Next.js): Error fetching/simulating credit report for internal processing:', e);
      errors.push(`Failed to retrieve credit report: ${e.message}`);
      return { error: errors.join('; '), jurisdiction, processingChannel };
    }

    try {
      summaryResult = await summarizeCreditReport({ creditReportDataUri });
    } catch (e: any) {
      console.error('Mooney Gateway (Next.js): Error summarizing credit report internally:', e);
      errors.push(`Failed to summarize credit report: ${e.message}`);
    }

    try {
      const disputeInput: SuggestDisputeLettersInput = {
        creditReportDataUri,
        userInformation: userInformation || `Information for identifier ${identifier}`,
        jurisdiction: jurisdiction || 'US', 
      };
      disputeLettersResult = await suggestDisputeLetters(disputeInput);
    } catch (e: any) {
      console.error('Mooney Gateway (Next.js): Error suggesting dispute letters internally:', e);
      errors.push(`Failed to suggest dispute letters: ${e.message}`);
    }

    if (errors.length > 0 && !summaryResult && !disputeLettersResult) {
      return { error: errors.join('; '), jurisdiction, processingChannel };
    }

    return {
      summary: summaryResult,
      disputeLetters: disputeLettersResult,
      error: errors.length > 0 ? errors.join('; ') : undefined,
      statusMessage: errors.length > 0 ? "Internal processing completed with some errors." : "Internal processing completed.",
      processingChannel,
      jurisdiction,
    };
  }
);

