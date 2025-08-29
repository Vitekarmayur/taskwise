"use client";

import { useState } from "react";
import type { Task } from "@/lib/types";
import { format, isToday, isTomorrow } from "date-fns";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  Trash2,
  Bell,
  Sparkles,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { generateReminderAction } from "@/app/actions";

interface TaskItemProps {
  task: Task;
  onUpdateTask: (id: string, updatedTask: Partial<Omit<Task, "id">>) => void;
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

interface Reminder {
  reminderMessage: string;
  motivationalMessage: string;
}

export function TaskItem({ task, onDeleteTask, onToggleComplete }: TaskItemProps) {
  const [isReminderLoading, setIsReminderLoading] = useState(false);
  const [reminder, setReminder] = useState<Reminder | null>(null);

  const priorityStyles = {
    low: "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300",
    medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300",
    high: "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300",
  };

  const formatDate = (date: Date | null) => {
    if (!date) return null;
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "MMM d");
  };

  const formattedDate = formatDate(task.dueDate);

  const handleGenerateReminder = async () => {
    setIsReminderLoading(true);
    setReminder(null);
    const result = await generateReminderAction(task, "User");
    if ("error" in result) {
      console.error(result.error);
    } else {
      setReminder(result);
    }
    setIsReminderLoading(false);
  };

  return (
    <li
      className={cn(
        "flex items-center p-4 transition-colors",
        task.completed && "bg-muted/50"
      )}
    >
      <Checkbox
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={() => onToggleComplete(task.id)}
        className="mr-4"
        aria-label={`Mark task as ${task.completed ? 'incomplete' : 'complete'}`}
      />
      <div className="flex-1 grid gap-1">
        <label
          htmlFor={`task-${task.id}`}
          className={cn(
            "font-medium cursor-pointer transition-all",
            task.completed && "line-through text-muted-foreground"
          )}
        >
          {task.description}
        </label>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {task.category && <Badge variant="secondary">{task.category}</Badge>}
          {formattedDate && (
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 ml-4">
        <Badge
          variant="outline"
          className={cn(
            "capitalize transition-colors",
            priorityStyles[task.priority]
          )}
        >
          {task.priority}
        </Badge>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-accent-foreground"
              onClick={handleGenerateReminder}
              aria-label="Generate Reminder"
            >
              <Bell className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-headline flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI-Powered Reminder
              </AlertDialogTitle>
              <AlertDialogDescription>
                {isReminderLoading && "Generating your personalized reminder..."}
                {reminder && (
                  <div className="space-y-4 mt-4 text-foreground">
                    <div>
                      <h4 className="font-semibold">Reminder:</h4>
                      <p>{reminder.reminderMessage}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Motivation Boost:</h4>
                      <p>{reminder.motivationalMessage}</p>
                    </div>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Got it!</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              aria-label="Delete Task"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-headline">Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                task.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDeleteTask(task.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </li>
  );
}
