'use server';

/**
 * @fileOverview Summarizes a user's credit report using AI.
 *
 * - summarizeCreditReport - A function that handles the summarization process.
 * - SummarizeCreditReportInput - The input type for the summarizeCreditReport function.
 * - SummarizeCreditReportOutput - The return type for the summarizeCreditReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCreditReportInputSchema = z.object({
  creditReportDataUri: z
    .string()
    .describe(
      'The credit report as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' /* added comment */
    ),
});
export type SummarizeCreditReportInput = z.infer<typeof SummarizeCreditReportInputSchema>;

const SummarizeCreditReportOutputSchema = z.object({
  summary: z.string().describe('A summary of the key issues in the credit report.'),
});
export type SummarizeCreditReportOutput = z.infer<typeof SummarizeCreditReportOutputSchema>;

export async function summarizeCreditReport(input: SummarizeCreditReportInput): Promise<SummarizeCreditReportOutput> {
  return summarizeCreditReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeCreditReportPrompt',
  input: {schema: SummarizeCreditReportInputSchema},
  output: {schema: SummarizeCreditReportOutputSchema},
  prompt: `You are an AI expert in helping users fix their credit.  You will summarize the credit report that is provided to you.

Credit Report:
{{media url=creditReportDataUri}}`,
});

const summarizeCreditReportFlow = ai.defineFlow(
  {
    name: 'summarizeCreditReportFlow',
    inputSchema: SummarizeCreditReportInputSchema,
    outputSchema: SummarizeCreditReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
