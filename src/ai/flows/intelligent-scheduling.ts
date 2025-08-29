// This file uses server-side code.
'use server';

/**
 * @fileOverview AI-powered intelligent scheduling flow.
 *
 * This module exports functions and types related to intelligent task scheduling.
 * It suggests optimal scheduling based on task urgency and user habits.
 *
 * @module src/ai/flows/intelligent-scheduling
 * @exports {
 *   suggestSchedule,
 *   IntelligentSchedulingInput,
 *   IntelligentSchedulingOutput
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Input schema for the intelligent scheduling flow.
 */
const IntelligentSchedulingInputSchema = z.object({
  taskDescription: z.string().describe('Description of the task to be scheduled.'),
  urgency: z.enum(['high', 'medium', 'low']).describe('Urgency level of the task.'),
  userHabits: z.string().describe('Description of the user scheduling habits.'),
});

/**
 * Type definition for the input to the intelligent scheduling flow.
 */
export type IntelligentSchedulingInput = z.infer<typeof IntelligentSchedulingInputSchema>;

/**
 * Output schema for the intelligent scheduling flow.
 */
const IntelligentSchedulingOutputSchema = z.object({
  suggestedSchedule: z.string().describe('AI-suggested schedule for the task, considering urgency and user habits.'),
  reasoning: z.string().describe('The AI reasoning behind the suggested schedule.'),
});

/**
 * Type definition for the output of the intelligent scheduling flow.
 */
export type IntelligentSchedulingOutput = z.infer<typeof IntelligentSchedulingOutputSchema>;

/**
 * Function to suggest a schedule for a given task.
 *
 * @param {IntelligentSchedulingInput} input - The input containing task description, urgency, and user habits.
 * @returns {Promise<IntelligentSchedulingOutput>} - A promise that resolves to the suggested schedule.
 */
export async function suggestSchedule(input: IntelligentSchedulingInput): Promise<IntelligentSchedulingOutput> {
  return intelligentSchedulingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentSchedulingPrompt',
  input: {
    schema: IntelligentSchedulingInputSchema,
  },
  output: {
    schema: IntelligentSchedulingOutputSchema,
  },
  prompt: `You are an AI assistant designed to provide optimal scheduling recommendations for tasks.

  Consider the following task details and user habits to generate a suitable schedule.

  Task Description: {{{taskDescription}}}
  Urgency: {{{urgency}}}
  User Habits: {{{userHabits}}}

  Provide a specific date and time for the suggested schedule and explain your reasoning.
`,
});

/**
 * Defines the intelligent scheduling flow using Genkit.
 */
const intelligentSchedulingFlow = ai.defineFlow(
  {
    name: 'intelligentSchedulingFlow',
    inputSchema: IntelligentSchedulingInputSchema,
    outputSchema: IntelligentSchedulingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
