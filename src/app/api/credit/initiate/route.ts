
import {NextRequest, NextResponse} from 'next/server';
import {
  InitiateCreditProcessingInputSchema,
  type ProcessCreditReportResult,
} from '@/lib/schemas/ai-actions';
import {
  fetchAndProcessCreditReport,
  type FetchAndProcessCreditReportOutput,
} from '@/ai/flows/fetch-and-process-credit-report';

export const runtime = 'nodejs'; // Ensure Node.js runtime

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validatedInput = InitiateCreditProcessingInputSchema.safeParse(body);

    if (!validatedInput.success) {
      return NextResponse.json(
        {
          error: 'Invalid input for credit processing.',
          details: validatedInput.error.flatten().fieldErrors,
        },
        {status: 400}
      );
    }

    const inputData = validatedInput.data;
    
    const result: FetchAndProcessCreditReportOutput = await fetchAndProcessCreditReport(inputData);

    const responsePayload: ProcessCreditReportResult = {
        summary: result.summary,
        disputeLetters: result.disputeLetters,
        error: result.error,
    };
    
    if (result.error) {
      // If there's an error, decide on the status code
      // If the core operation failed (e.g., couldn't "fetch" report), it might be a 500 or specific client error.
      // If partial success, still 200 but with error info.
      if (!result.summary && !result.disputeLetters) {
        return NextResponse.json(responsePayload, {status: 500}); // Complete failure
      }
    }

    return NextResponse.json(responsePayload, {status: 200});

  } catch (error: any) {
    console.error('API: Error in POST /api/credit/initiate:', error);
    return NextResponse.json(
      {error: error.message || 'An unexpected error occurred.'},
      {status: 500}
    );
  }
}
