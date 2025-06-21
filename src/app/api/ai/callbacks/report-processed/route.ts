import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';
import {getFirebaseAdminDb} from '@/lib/firebase/firebaseAdmin';
import {Timestamp}from 'firebase-admin/firestore';

export const runtime = 'nodejs'; // Ensure Node.js runtime

// Schema for the callback when a credit report has been ingested and initially processed
const ReportProcessedCallbackSchema = z.object({
  reportId: z.string().describe('The unique identifier for the processed report.'),
  userId: z.string().optional().describe('The user ID associated with this report, if known at this stage.'),
  status: z.enum(['SUCCESS', 'FAILURE', 'PARTIAL']).describe('The status of the ingestion and initial processing.'),
  structuredDataUrl: z.string().url().optional().describe('URL to the structured data if processing was successful.'),
  message: z.string().optional().describe('Optional message, e.g., details about partial success or failure.'),
  error: z.string().optional().describe('Error message if processing failed.'),
  timestamp: z.string().datetime().optional().default(() => new Date().toISOString()),
});

export type ReportProcessedCallbackInput = z.infer<typeof ReportProcessedCallbackSchema>;

export async function POST(request: NextRequest) {
  const db = getFirebaseAdminDb();
  if (!db) {
    return NextResponse.json({error: 'Firebase Admin SDK (Firestore) not initialized.'}, {status: 500});
  }

  // TODO: Implement API Key authentication for callback endpoints
  // const apiKey = request.headers.get('X-Python-Service-API-Key');
  // if (apiKey !== process.env.PYTHON_TO_GATEWAY_CALLBACK_API_KEY) { // Ensure this env var is set
  //   console.warn('Unauthorized callback attempt to /api/ai/callbacks/report-processed');
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const body = await request.json();
    const validation = ReportProcessedCallbackSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({error: 'Invalid request body', details: validation.error.flatten()}, {status: 400});
    }

    const callbackData = validation.data;

    const reportRef = db.collection('reports').doc(callbackData.reportId);
    
    const reportUpdateData: any = {
      reportId: callbackData.reportId,
      // Assuming 'status' in Firestore needs more specific values than just 'SUCCESS'/'FAILURE' from callback
      status: callbackData.status === 'SUCCESS' ? 'SUCCESS_EXTERNAL_INGESTION_COMPLETE' : 
              callbackData.status === 'PARTIAL' ? 'PARTIAL_EXTERNAL_INGESTION' : 'FAILURE_EXTERNAL_INGESTION',
      ingestionMessage: callbackData.message || null,
      ingestionError: callbackData.error || null,
      ingestionTimestamp: Timestamp.fromDate(new Date(callbackData.timestamp)),
      structuredDataUrl: callbackData.structuredDataUrl || null, // Store the URL if provided
      lastUpdatedAt: Timestamp.now(),
    };
    if (callbackData.userId) reportUpdateData.userId = callbackData.userId;
    
    await reportRef.set(reportUpdateData, {merge: true});
    
    console.log('Mooney Gateway (Next.js): Received and processed report-processed callback for report:', callbackData.reportId);

    // Example: Trigger next AI step (e.g., analysis if ingestion was successful)
    // if (callbackData.status === 'SUCCESS' && callbackData.structuredDataUrl) {
    //   // This might involve making another call to a different Python service,
    //   // or updating a status that another service is polling.
    //   // For instance, if the Credit Analysis service pulls jobs:
    //   await reportRef.update({ status: 'READY_FOR_ANALYSIS_EXTERNAL' });
    // } else if (callbackData.status === 'FAILURE') {
    //   // await notifyUserOfProcessingFailure(callbackData.reportId, callbackData.error);
    // }

    return NextResponse.json({message: 'Callback received successfully by Mooney Gateway', reportId: callbackData.reportId}, {status: 200});
  } catch (error: any) {
    console.error('Mooney Gateway (Next.js): Error processing report-processed callback:', error);
    return NextResponse.json({error: 'Failed to process callback', details: error.message}, {status: 500});
  }
}
