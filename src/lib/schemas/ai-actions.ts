
import type { SummarizeCreditReportOutput } from "@/ai/flows/summarize-credit-report";
import type { SuggestDisputeLettersOutput } from "@/ai/flows/suggest-dispute-letters";
import { z } from "zod";

export const InitiateCreditProcessingInputSchema = z.object({
  identifier: z.string().min(1, { message: "Identifier is required." }),
  userInformation: z.string().optional(),
  jurisdiction: z.enum(['US', 'UK'], { message: "Jurisdiction must be 'US' or 'UK'."}).default('US').optional(),
  processingChannel: z.enum(['internal', 'external'], { message: "Processing channel must be 'internal' or 'external'."}).default('internal').optional(),
  userId: z.string().optional(), // Added userId
});

export type InitiateCreditProcessingInput = z.infer<typeof InitiateCreditProcessingInputSchema>;

export interface ProcessCreditReportResult {
  summary?: SummarizeCreditReportOutput;
  disputeLetters?: SuggestDisputeLettersOutput;
  error?: string;
  statusMessage?: string; 
  reportId?: string;
  processingChannel?: 'internal' | 'external';
  jurisdiction?: 'US' | 'UK'; // Added jurisdiction
}

