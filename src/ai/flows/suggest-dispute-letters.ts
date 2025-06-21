
'use server';
/**
 * @fileOverview AI-powered credit dispute letter generation with multi-step agentic behavior.
 *
 * - suggestDisputeLetters - A function that generates personalized dispute letters based on a credit report.
 * - SuggestDisputeLettersInput - The input type for the suggestDisputeLetters function.
 * - SuggestDisputeLettersOutput - The return type for the suggestDisputeLetters function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define internal schemas for multi-step processing
const IdentifiedInaccuracySchema = z.object({
  itemDescription: z.string().describe("A concise description of the inaccurate item from the credit report."),
  reasonForDispute: z.string().describe("The specific reason why this item is believed to be inaccurate (e.g., 'not my account', 'incorrect balance', 'late payment incorrectly reported')."),
  accountNumber: z.string().optional().describe("The account number associated with the inaccurate item, if available."),
});
type IdentifiedInaccuracy = z.infer<typeof IdentifiedInaccuracySchema>;

const DisputeStrategyInputSchema = IdentifiedInaccuracySchema.extend({
  jurisdiction: z.enum(['US', 'UK']).describe("The jurisdiction (US or UK) for which legal/strategic information is required."),
});
type DisputeStrategyInput = z.infer<typeof DisputeStrategyInputSchema>;

const DisputeStrategyOutputSchema = z.object({
  strategySuggestion: z.string().describe("A brief suggestion for a dispute strategy or relevant points to mention, tailored to the jurisdiction."),
  relevantLawSnippet: z.string().optional().describe("A short (simulated) snippet of a relevant law or regulation for the jurisdiction, if applicable."),
});
type DisputeStrategyOutput = z.infer<typeof DisputeStrategyOutputSchema>;

const DraftLetterInputSchema = z.object({
  inaccuracy: IdentifiedInaccuracySchema,
  strategy: DisputeStrategyOutputSchema,
  userInformation: z.string().describe("Relevant user information for personalization."),
  creditReportDataUri: z.string().describe("The full credit report as a data URI for context."),
  jurisdiction: z.enum(['US', 'UK']).describe("The jurisdiction (US or UK) for which the letter should be tailored."),
});

// Define the main input/output schemas for the exported flow
const SuggestDisputeLettersInputSchema = z.object({
  creditReportDataUri: z
    .string()
    .describe(
      "The user credit report, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  userInformation: z
    .string()
    .describe(
      'Any relevant user information that could help personalize the dispute letters.'
    ),
  jurisdiction: z.enum(['US', 'UK']).default('US').optional()
    .describe('The jurisdiction for which to tailor dispute strategies and letters (US or UK). Defaults to US.'),
});

export type SuggestDisputeLettersInput = z.infer<
  typeof SuggestDisputeLettersInputSchema
>;

const SuggestDisputeLettersOutputSchema = z.object({
  disputeLetters: z
    .array(z.string())
    .describe('An array of personalized dispute letters.'),
});

export type SuggestDisputeLettersOutput = z.infer<
  typeof SuggestDisputeLettersOutputSchema
>;

export async function suggestDisputeLetters(
  input: SuggestDisputeLettersInput
): Promise<SuggestDisputeLettersOutput> {
  return suggestDisputeLettersFlow(input);
}

// Tool: Simulate looking up dispute strategies
const lookupDisputeStrategyTool = ai.defineTool(
  {
    name: 'lookupDisputeStrategyTool',
    description: 'Simulates looking up dispute strategies and relevant legal clauses for a credit report inaccuracy based on jurisdiction.',
    inputSchema: DisputeStrategyInputSchema,
    outputSchema: DisputeStrategyOutputSchema,
  },
  async (input) => {
    // Simulate strategy lookup
    let strategySuggestion = `For an item described as '${input.itemDescription}' with reason '${input.reasonForDispute}'`;
    let relevantLawSnippet = "";

    if (input.jurisdiction === 'US') {
      strategySuggestion += ` in the US, consider citing the Fair Credit Reporting Act (FCRA). Ensure you clearly state the inaccuracy and request its removal or correction.`;
      relevantLawSnippet = `FCRA Section 611(a)(1)(A): "Subject to subsection (f), if the completeness or accuracy of any item of information contained in a consumer’s file at a consumer reporting agency is disputed by the consumer and the consumer notifies the agency directly, or indirectly through a reseller, of such dispute, the agency shall, free of charge, conduct a reasonable reinvestigation..." (Simulated Snippet)`;
    } else if (input.jurisdiction === 'UK') {
      strategySuggestion += ` in the UK, refer to the Consumer Credit Act or GDPR principles regarding data accuracy. Clearly outline the error and request rectification.`;
      relevantLawSnippet = `Data Protection Act 2018 (UK GDPR) Article 5(1)(d): "Personal data shall be accurate and, where necessary, kept up to date; every reasonable step must be taken to ensure that personal data that are inaccurate, having regard to the purposes for which they are processed, are erased or rectified without delay (‘accuracy’)." (Simulated Snippet)`;
    }
    
    return {
      strategySuggestion,
      relevantLawSnippet: relevantLawSnippet || undefined,
    };
  }
);

// Prompt 1: Identify Inaccuracies
const identifyInaccuraciesPrompt = ai.definePrompt({
  name: 'identifyInaccuraciesPrompt',
  input: { schema: SuggestDisputeLettersInputSchema }, // Uses the main input
  output: { schema: z.object({ inaccuracies: z.array(IdentifiedInaccuracySchema) }) },
  prompt: `You are an expert credit analyst. Analyze the provided credit report and user information. Identify all potential inaccuracies.
For each inaccuracy, provide a concise description of the item, the reason it might be disputed, and the associated account number if available.

Jurisdiction for analysis: {{jurisdiction}}
User Information:
{{{userInformation}}}

Credit Report:
{{media url=creditReportDataUri}}

List of Identified Inaccuracies:`,
});

// Prompt 2: Draft Dispute Letter
const draftDisputeLetterPrompt = ai.definePrompt({
  name: 'draftDisputeLetterPrompt',
  input: { schema: DraftLetterInputSchema },
  output: { schema: z.object({ letter: z.string() }) },
  prompt: `You are an AI assistant specializing in crafting effective credit dispute letters.
Given the identified inaccuracy, the suggested dispute strategy, user information, and the full credit report for context, draft a professional and clear dispute letter.
Ensure the letter is tailored for the {{jurisdiction}} jurisdiction.

User Information for Letter Personalization:
{{{userInformation}}}

Identified Inaccuracy:
- Description: {{{inaccuracy.itemDescription}}}
- Reason for Dispute: {{{inaccuracy.reasonForDispute}}}
{{#if inaccuracy.accountNumber}}
- Account Number: {{{inaccuracy.accountNumber}}}
{{/if}}

Suggested Strategy & Legal Context ({{jurisdiction}}):
- Strategy: {{{strategy.strategySuggestion}}}
{{#if strategy.relevantLawSnippet}}
- Relevant Law Snippet (for context, do not quote directly unless appropriate): {{{strategy.relevantLawSnippet}}}
{{/if}}

Full Credit Report (for context, refer to specific details as needed):
{{media url=creditReportDataUri}}

Drafted Dispute Letter:`,
});


// The main multi-step flow
const suggestDisputeLettersFlow = ai.defineFlow(
  {
    name: 'suggestDisputeLettersFlow',
    inputSchema: SuggestDisputeLettersInputSchema,
    outputSchema: SuggestDisputeLettersOutputSchema,
  },
  async (input) => {
    const { creditReportDataUri, userInformation, jurisdiction = 'US' } = input;
    const draftedLetters: string[] = [];

    // Step 1: Identify inaccuracies
    const { output: identifyOutput } = await identifyInaccuraciesPrompt(input);
    const identifiedInaccuracies = identifyOutput?.inaccuracies || [];

    if (identifiedInaccuracies.length === 0) {
      return { disputeLetters: [] }; // No inaccuracies found
    }

    // Step 2 & 3: For each inaccuracy, get strategy and draft letter
    for (const inaccuracy of identifiedInaccuracies) {
      try {
        // Step 2a: Look up dispute strategy using the tool
        const strategyOutput = await lookupDisputeStrategyTool({
          ...inaccuracy,
          jurisdiction,
        });

        // Step 2b: Draft the letter
        const { output: draftOutput } = await draftDisputeLetterPrompt({
          inaccuracy,
          strategy: strategyOutput,
          userInformation,
          creditReportDataUri,
          jurisdiction,
        });

        if (draftOutput?.letter) {
          draftedLetters.push(draftOutput.letter);
        }
      } catch (error: any) {
        console.error(`Error processing inaccuracy "${inaccuracy.itemDescription}": ${error.message}`);
        // Optionally, collect errors or decide if one error should halt the whole process
        // For now, we'll skip this letter and continue
      }
    }

    return { disputeLetters: draftedLetters };
  }
);
