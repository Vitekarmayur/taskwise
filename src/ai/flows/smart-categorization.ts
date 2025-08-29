'use server';

/**
 * @fileOverview Provides AI-driven task categorization suggestions based on task descriptions.
 *
 * - suggestTaskCategories - An async function that suggests task categories.
 * - SmartCategorizationInput - The input type for the suggestTaskCategories function.
 * - SmartCategorizationOutput - The return type for the suggestTaskCategories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartCategorizationInputSchema = z.object({
  taskDescription: z
    .string()
    .describe('The description of the task for which categories are to be suggested.'),
});
export type SmartCategorizationInput = z.infer<typeof SmartCategorizationInputSchema>;

const SmartCategorizationOutputSchema = z.object({
  suggestedCategories: z
    .array(z.string())
    .describe('An array of suggested categories for the task.'),
});
export type SmartCategorizationOutput = z.infer<typeof SmartCategorizationOutputSchema>;

export async function suggestTaskCategories(
  input: SmartCategorizationInput
): Promise<SmartCategorizationOutput> {
  return smartCategorizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartCategorizationPrompt',
  input: {schema: SmartCategorizationInputSchema},
  output: {schema: SmartCategorizationOutputSchema},
  prompt: `Suggest categories for the following task description:

Task Description: {{{taskDescription}}}

Categories:`, // The LLM will generate suggested categories based on the description
});

const smartCategorizationFlow = ai.defineFlow(
  {
    name: 'smartCategorizationFlow',
    inputSchema: SmartCategorizationInputSchema,
    outputSchema: SmartCategorizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
