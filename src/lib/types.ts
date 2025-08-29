export type Task = {
  id: string;
  description: string;
  dueDate: Date | null;
  priority: "low" | "medium" | "high";
  completed: boolean;
  category?: string;
};
