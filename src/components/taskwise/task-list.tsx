"use client";

import type { Task } from "@/lib/types";
import { TaskItem } from "./task-item";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (id: string, updatedTask: Partial<Omit<Task, "id">>) => void;
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export function TaskList({ tasks, onUpdateTask, onDeleteTask, onToggleComplete }: TaskListProps) {
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium font-headline">No tasks yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Click "Add Task" to get started.
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <ul className="divide-y">
          {sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
              onToggleComplete={onToggleComplete}
            />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
