import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';
import {getFirebaseAdminDb} from '@/lib/firebase/firebaseAdmin';
import {Timestamp} from 'firebase-admin/firestore';

export const runtime = 'nodejs'; // Ensure Node.js runtime

// Schema for the callback when credit analysis and dispute generation are complete
const AnalysisCompleteCallbackSchema = z.object({
  reportId: z.string().describe('The unique identifier for the report that was analyzed.'),
  userId: z.string().optional().describe('The user ID associated with this report.'),
  status: z.enum(['SUCCESS', 'FAILURE']).describe('The status of the analysis.'),
  summary: z.string().optional().describe('The summary of the credit report analysis.'),
  disputeLetters: z.array(z.object({ letterId: z.string(), content: z.string() })).optional().describe('An array of generated dispute letters with their IDs and content.'),
  recommendations: z.array(z.string()).optional().describe('Optimization recommendations (future phase).'),
  error: z.string().optional().describe('Error message if analysis failed.'),
  timestamp: z.string().datetime().optional().default(() => new Date().toISOString()),
});

export type AnalysisCompleteCallbackInput = z.infer<typeof AnalysisCompleteCallbackSchema>;

export async function POST(request: NextRequest) {
  const db = getFirebaseAdminDb();
  if (!db) {
    return NextResponse.json({error: 'Firebase Admin SDK (Firestore) not initialized.'}, {status: 500});
  }
  
  // TODO: Implement API Key authentication for callback endpoints
  // const apiKey = request.headers.get('X-Python-Service-API-Key');
  // if (apiKey !== process.env.PYTHON_TO_GATEWAY_CALLBACK_API_KEY) { // Ensure this env var is set
  //   console.warn('Unauthorized callback attempt to /api/ai/callbacks/analysis-complete');
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const body = await request.json();
    const validation = AnalysisCompleteCallbackSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({error: 'Invalid request body', details: validation.error.flatten()}, {status: 400});
    }

    const callbackData = validation.data;
    const reportRef = db.collection('reports').doc(callbackData.reportId);
    const batch = db.batch();

    const reportUpdateData: any = {
      // Assuming 'status' in Firestore reflects the AI analysis outcome directly
      status: callbackData.status === 'SUCCESS' ? 'SUCCESS_EXTERNAL_ANALYSIS_COMPLETE' : 'FAILURE_EXTERNAL_ANALYSIS_FAILED',
      analysisSummary: callbackData.summary || null,
      analysisRecommendations: callbackData.recommendations || [],
      analysisError: callbackData.error || null,
      analysisTimestamp: Timestamp.fromDate(new Date(callbackData.timestamp)),
      analysisDisputeLetters: callbackData.disputeLetters || [], // Store full dispute letters here for easier UI display
      lastUpdatedAt: Timestamp.now(),
    };
    if(callbackData.userId) reportUpdateData.userId = callbackData.userId;

    batch.set(reportRef, reportUpdateData, {merge: true});

    // If you still want to store dispute letters in a separate collection as well:
    if (callbackData.disputeLetters && callbackData.disputeLetters.length > 0) {
      const disputeLetterIds: string[] = [];
      callbackData.disputeLetters.forEach(letter => {
        const letterId = letter.letterId || db.collection('disputeLetters').doc().id; // Generate ID if not provided
        disputeLetterIds.push(letterId);
        const disputeLetterRef = db.collection('disputeLetters').doc(letterId);
        batch.set(disputeLetterRef, {
          letterId: letterId,
          reportId: callbackData.reportId,
          userId: callbackData.userId, 
          content: letter.content,
          status: 'Generated_External', 
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          source: 'external_python_service',
        });
      });
      // Add these IDs to the main report document if you prefer linking instead of embedding full letters
      // batch.set(reportRef, { externalDisputeLetterIds: disputeLetterIds }, {merge: true});
    }
    
    await batch.commit();
    console.log('Mooney Gateway (Next.js): Received and processed analysis-complete callback for report:', callbackData.reportId);

    // Example: Notify user (conceptual)
    // if (callbackData.status === 'SUCCESS') {
    //   await notifyUserAnalysisReady(callbackData.reportId, callbackData.summary, callbackData.disputeLetters);
    // } else {
    //   await notifyUserOfAnalysisFailure(callbackData.reportId, callbackData.error);
    // }

    return NextResponse.json({message: 'Callback received successfully by Mooney Gateway', reportId: callbackData.reportId}, {status: 200});
  } catch (error: any) {
    console.error('Mooney Gateway (Next.js): Error processing analysis-complete callback:', error);
    return NextResponse.json({error: 'Failed to process callback', details: error.message}, {status: 500});
  }
}
