"use server";

import { suggestTaskCategories } from "@/ai/flows/smart-categorization";
import { suggestSchedule } from "@/ai/flows/intelligent-scheduling";
import { generateReminderMessage } from "@/ai/flows/ai-powered-reminders";
import type { Task } from "@/lib/types";

export async function suggestCategoriesAction(taskDescription: string) {
  if (!taskDescription) {
    return { suggestedCategories: [] };
  }
  try {
    const result = await suggestTaskCategories({ taskDescription });
    return result;
  } catch (error) {
    console.error("Error suggesting categories:", error);
    return { suggestedCategories: [] };
  }
}

export async function suggestScheduleAction(
  taskDescription: string,
  urgency: "low" | "medium" | "high",
  userHabits: string
) {
  if (!taskDescription || !userHabits) {
    return { error: "Task description and user habits are required." };
  }
  try {
    const result = await suggestSchedule({ taskDescription, urgency, userHabits });
    return result;
  } catch (error) {
    console.error("Error suggesting schedule:", error);
    return { error: "Failed to suggest a schedule." };
  }
}

export async function generateReminderAction(task: Task, userName: string) {
  try {
    const result = await generateReminderMessage({
      taskDescription: task.description,
      dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : "not set",
      priority: task.priority,
      userName: userName,
    });
    return result;
  } catch (error) {
    console.error("Error generating reminder:", error);
    return { error: "Failed to generate a reminder." };
  }
}
