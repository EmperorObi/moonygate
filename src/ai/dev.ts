
import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-dispute-letters.ts';
import '@/ai/flows/summarize-credit-report.ts';
import '@/ai/flows/fetch-and-process-credit-report.ts';
import '@/ai/flows/simple-task-orchestrator.ts'; // Added new flow
