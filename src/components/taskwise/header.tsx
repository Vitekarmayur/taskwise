"use client";

import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddTaskDialog } from "./add-task-dialog";
import type { Task } from "@/lib/types";

interface HeaderProps {
  onAddTask: (task: Omit<Task, "id" | "completed">) => void;
}

export function Header({ onAddTask }: HeaderProps) {
  return (
    <header className="flex items-center justify-between py-4 border-b">
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8 text-primary"
        >
          <path d="M9 12l2 2 4-4" />
          <path d="M5 12h14" />
          <path d="M5 7h14" />
          <path d="M5 17h14" />
        </svg>
        <h1 className="text-3xl font-bold font-headline text-foreground">
          TaskWise
        </h1>
      </div>
      <AddTaskDialog onAddTask={onAddTask}>
        <Button>
          <PlusCircle className="mr-2 h-5 w-5" />
          Add Task
        </Button>
      </AddTaskDialog>
    </header>
  );
}
