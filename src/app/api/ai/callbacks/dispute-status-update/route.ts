import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';
import {getFirebaseAdminDb} from '@/lib/firebase/firebaseAdmin';
import {Timestamp}from 'firebase-admin/firestore';

export const runtime = 'nodejs'; // Ensure Node.js runtime

// Schema for the callback when a dispute's status is updated
const DisputeStatusUpdateCallbackSchema = z.object({
  disputeId: z.string().describe('The unique identifier for the dispute.'),
  reportId: z.string().describe('The unique identifier for the associated credit report.'),
  userId: z.string().describe('The user ID associated with this dispute.'),
  newStatus: z.string().describe('The new status of the dispute (e.g., "Sent", "Acknowledged", "Resolved", "Rejected").'),
  updatedAt: z.string().datetime().optional().default(() => new Date().toISOString()),
  details: z.string().optional().describe('Additional details about the status update (e.g., response from bureau).'),
  externalReferenceId: z.string().optional().describe('Reference ID from the credit bureau, if applicable.'),
});

export type DisputeStatusUpdateCallbackInput = z.infer<typeof DisputeStatusUpdateCallbackSchema>;

export async function POST(request: NextRequest) {
  const db = getFirebaseAdminDb();
  if (!db) {
    return NextResponse.json({error: 'Firebase Admin SDK (Firestore) not initialized.'}, {status: 500});
  }

  // TODO: Implement API Key authentication for callback endpoints
  // const apiKey = request.headers.get('X-Python-Service-API-Key');
  // if (apiKey !== process.env.PYTHON_TO_GATEWAY_CALLBACK_API_KEY) { // Ensure this env var is set
  //   console.warn('Unauthorized callback attempt to /api/ai/callbacks/dispute-status-update');
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const body = await request.json();
    const validation = DisputeStatusUpdateCallbackSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({error: 'Invalid request body', details: validation.error.flatten()}, {status: 400});
    }

    const callbackData = validation.data;

    const disputeRef = db.collection('disputeLetters').doc(callbackData.disputeId); // Assuming 'disputeId' is the document ID
    
    const disputeUpdateData = {
      status: callbackData.newStatus, // Directly use the newStatus from callback
      details: callbackData.details || null,
      externalReferenceId: callbackData.externalReferenceId || null,
      updatedAt: Timestamp.fromDate(new Date(callbackData.updatedAt)),
      // Ensure reportId and userId are part of the update if they might change,
      // or if creating the document for the first time with this callback.
      // However, usually these are set on creation.
      ...(callbackData.reportId && { reportId: callbackData.reportId }),
      ...(callbackData.userId && { userId: callbackData.userId }),
    };

    const docSnap = await disputeRef.get();
    if (!docSnap.exists) {
        console.warn(`Mooney Gateway (Next.js): Dispute document ${callbackData.disputeId} not found for status update. Update skipped, but returning success to caller.`);
        // Depending on requirements, you might create it: await disputeRef.set(disputeUpdateData, { merge: true });
        // Or return an error if it's unexpected for a dispute to not exist:
        // return NextResponse.json({ error: `Dispute ${callbackData.disputeId} not found.` }, { status: 404 });
    } else {
       await disputeRef.update(disputeUpdateData);
    }
        
    console.log('Mooney Gateway (Next.js): Received and processed dispute-status-update callback for dispute:', callbackData.disputeId);

    // Example: Notify user (conceptual)
    // await notifyUserOfDisputeStatus(callbackData.userId, callbackData.disputeId, callbackData.newStatus, callbackData.details);
    
    return NextResponse.json({message: 'Callback received successfully by Mooney Gateway', disputeId: callbackData.disputeId}, {status: 200});
  } catch (error: any)
   {
    console.error('Mooney Gateway (Next.js): Error processing dispute-status-update callback:', error);
    return NextResponse.json({error: 'Failed to process callback', details: error.message}, {status: 500});
  }
}
