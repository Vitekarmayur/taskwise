'use server';

/**
 * @fileOverview AI-powered reminders and motivational messages for overdue or high-priority tasks.
 *
 * - generateReminderMessage - A function that generates personalized reminders and motivational messages.
 * - ReminderMessageInput - The input type for the generateReminderMessage function.
 * - ReminderMessageOutput - The return type for the generateReminderMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReminderMessageInputSchema = z.object({
  taskDescription: z.string().describe('Description of the task.'),
  dueDate: z.string().describe('Due date of the task (e.g., YYYY-MM-DD).'),
  priority: z.enum(['high', 'medium', 'low']).describe('Priority of the task.'),
  userName: z.string().describe('The name of the user.'),
});
export type ReminderMessageInput = z.infer<typeof ReminderMessageInputSchema>;

const ReminderMessageOutputSchema = z.object({
  reminderMessage: z.string().describe('Personalized reminder message.'),
  motivationalMessage: z.string().describe('Motivational message to encourage task completion.'),
});
export type ReminderMessageOutput = z.infer<typeof ReminderMessageOutputSchema>;

export async function generateReminderMessage(input: ReminderMessageInput): Promise<ReminderMessageOutput> {
  return generateReminderMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reminderMessagePrompt',
  input: {schema: ReminderMessageInputSchema},
  output: {schema: ReminderMessageOutputSchema},
  prompt: `You are a helpful AI assistant that generates personalized reminders and motivational messages for users to help them complete their tasks.

  Based on the task description, due date, priority, and user name, create a reminder message and a motivational message.

  Task Description: {{{taskDescription}}}
  Due Date: {{{dueDate}}}
  Priority: {{{priority}}}
  User Name: {{{userName}}}

  Reminder Message: A personalized reminder message for the task.
  Motivational Message: A motivational message to encourage the user to complete the task.
  `,
});

const generateReminderMessageFlow = ai.defineFlow(
  {
    name: 'generateReminderMessageFlow',
    inputSchema: ReminderMessageInputSchema,
    outputSchema: ReminderMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
