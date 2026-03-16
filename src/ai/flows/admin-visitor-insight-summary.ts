'use server';
/**
 * @fileOverview An AI agent that provides natural language summaries and trend analyses of library visitor data.
 *
 * - adminVisitorInsightSummary - A function that handles the generation of visitor insight summaries.
 * - AdminVisitorInsightSummaryInput - The input type for the adminVisitorInsightSummary function.
 * - AdminVisitorInsightSummaryOutput - The return type for the adminVisitorInsightSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdminVisitorInsightSummaryInputSchema = z.object({
  dateRange: z
    .string()
    .describe(
      'The date range for which the visitor data is valid (e.g., "Today", "This Week", "2023-01-01 to 2023-01-31").'
    ),
  totalVisitors: z.number().describe('The total number of visitors in the specified date range.').int().positive(),
  reasonBreakdown: z
    .record(z.string(), z.number().int().nonnegative())
    .describe('A map of visit reasons to the number of visitors for each reason.'),
  collegeBreakdown: z
    .record(z.string(), z.number().int().nonnegative())
    .describe('A map of college affiliations to the number of visitors from each college.'),
  employeeStatusBreakdown: z
    .record(z.string(), z.number().int().nonnegative())
    .describe('A map of employee statuses (e.g., Student, Faculty, Staff) to the number of visitors for each status.'),
});
export type AdminVisitorInsightSummaryInput = z.infer<
  typeof AdminVisitorInsightSummaryInputSchema
>;

const AdminVisitorInsightSummaryOutputSchema = z.object({
  summary: z.string().describe('An AI-generated natural language summary and trend analysis of the visitor data.'),
});
export type AdminVisitorInsightSummaryOutput = z.infer<
  typeof AdminVisitorInsightSummaryOutputSchema
>;

export async function adminVisitorInsightSummary(
  input: AdminVisitorInsightSummaryInput
): Promise<AdminVisitorInsightSummaryOutput> {
  return adminVisitorInsightSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adminVisitorInsightSummaryPrompt',
  input: {schema: AdminVisitorInsightSummaryInputSchema},
  output: {schema: AdminVisitorInsightSummaryOutputSchema},
  prompt: `You are an expert library data analyst. Your task is to provide a concise and insightful natural language summary of the NEU Library visitor data, highlighting key trends and patterns.

Here is the visitor data for the {{dateRange}}:

Total Visitors: {{totalVisitors}}

Breakdown by Reason for Visit:
{{#each reasonBreakdown}}
- {{ @key }}: {{ this }} visitors
{{/each}}

Breakdown by College Affiliation:
{{#each collegeBreakdown}}
- {{ @key }}: {{ this }} visitors
{{/each}}

Breakdown by Employee Status:
{{#each employeeStatusBreakdown}}
- {{ @key }}: {{ this }} visitors
{{/each}}

Based on this data, provide a summary focusing on:
1. Overall visitor numbers and any significant changes or observations.
2. The most popular reasons for visiting.
3. Dominant college affiliations.
4. The proportion of visitors who are employees (faculty/staff) versus students.
5. Any other notable trends or insights you can infer.`,
});

const adminVisitorInsightSummaryFlow = ai.defineFlow(
  {
    name: 'adminVisitorInsightSummaryFlow',
    inputSchema: AdminVisitorInsightSummaryInputSchema,
    outputSchema: AdminVisitorInsightSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
