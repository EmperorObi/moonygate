
"use server";

import { 
  fetchAndProcessCreditReport,
  type FetchAndProcessCreditReportInput,
  type FetchAndProcessCreditReportOutput 
} from "@/ai/flows/fetch-and-process-credit-report";
import { InitiateCreditProcessingInputSchema, type ProcessCreditReportResult } from "@/lib/schemas/ai-actions";


export async function initiateCreditProcessingAction(
  prevState: ProcessCreditReportResult | null, 
  formData: FormData
): Promise<ProcessCreditReportResult> {
  try {
    const identifier = formData.get("identifier") as string | null;
    const userInformation = (formData.get("userInformation") as string) || undefined;
    const jurisdiction = (formData.get("jurisdiction") as 'US' | 'UK' | null) || 'US'; // Default to US if not provided
    const processingChannel = (formData.get("processingChannel") as 'internal' | 'external' | null) || 'internal'; // Default to internal
    const userId = undefined; // Placeholder: In a real app, get this from the authenticated session

    const validatedInput = InitiateCreditProcessingInputSchema.safeParse({
      identifier,
      userInformation,
      jurisdiction,
      processingChannel,
      userId,
    });

    if (!validatedInput.success) {
      const errorMessages = validatedInput.error.flatten().fieldErrors;
      let combinedErrorMessage = "";
      if (errorMessages.identifier) combinedErrorMessage += `Identifier: ${errorMessages.identifier.join(', ')}. `;
      if (errorMessages.userInformation) combinedErrorMessage += `User Information: ${errorMessages.userInformation.join(', ')}. `;
      if (errorMessages.jurisdiction) combinedErrorMessage += `Jurisdiction: ${errorMessages.jurisdiction.join(', ')}. `;
      if (errorMessages.processingChannel) combinedErrorMessage += `Processing Channel: ${errorMessages.processingChannel.join(', ')}. `;
      
      const finalErrorMsg = combinedErrorMessage.trim();
      return { 
        error: finalErrorMsg.length > 0 ? `Invalid input: ${finalErrorMsg}` : "Invalid input.",
        processingChannel, // Return channel even on validation error for UI state
        jurisdiction, // Return jurisdiction for UI state
      };
    }
    
    const inputData: FetchAndProcessCreditReportInput = validatedInput.data;

    const result: FetchAndProcessCreditReportOutput = await fetchAndProcessCreditReport(inputData);
    
    if (result.error && !result.summary && !result.disputeLetters && !result.statusMessage && !result.reportId) {
        return { 
            error: result.error, 
            processingChannel: result.processingChannel || processingChannel, 
            jurisdiction: result.jurisdiction || jurisdiction 
        };
    }

    return {
      summary: result.summary,
      disputeLetters: result.disputeLetters,
      error: result.error,
      statusMessage: result.statusMessage,
      reportId: result.reportId,
      processingChannel: result.processingChannel || processingChannel,
      jurisdiction: result.jurisdiction || jurisdiction,
    };

  } catch (error: any) {
    console.error("Error in initiateCreditProcessingAction:", error);
    return { 
        error: error.message || "An unexpected error occurred during credit processing.",
        // Provide defaults for channel and jurisdiction in case of unforeseen error
        processingChannel: (formData.get("processingChannel") as 'internal' | 'external' | null) || 'internal',
        jurisdiction: (formData.get("jurisdiction") as 'US' | 'UK' | null) || 'US',
    };
  }
}

