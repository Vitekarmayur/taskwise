"use client";

import { useState, useMemo, useEffect } from "react";
import type { Task } from "@/lib/types";
import { Header } from "@/components/taskwise/header";
import { TaskList } from "@/components/taskwise/task-list";
import { ProgressTracker } from "@/components/taskwise/progress-tracker";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Load tasks from local storage on initial render
    try {
      const storedTasks = localStorage.getItem("taskwise-tasks");
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks, (key, value) => {
           if (key === 'dueDate' && value) {
            return new Date(value);
          }
          return value;
        });
        setTasks(parsedTasks);
      } else {
        // Set initial dummy data if no tasks are stored
        setTasks([
          {
            id: "1",
            description: "Finish the presentation for the meeting",
            dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
            priority: "high",
            completed: false,
            category: "Work",
          },
          {
            id: "2",
            description: "Buy groceries for the week",
            dueDate: new Date(),
            priority: "medium",
            completed: false,
            category: "Personal",
          },
          {
            id: "3",
            description: "Read a chapter of 'The Pragmatic Programmer'",
            dueDate: null,
            priority: "low",
            completed: true,
            category: "Learning",
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to load tasks from local storage", error);
    }
  }, []);

  useEffect(() => {
    // Save tasks to local storage whenever they change
    try {
      localStorage.setItem("taskwise-tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks to local storage", error);
    }
  }, [tasks]);


  const addTask = (task: Omit<Task, "id" | "completed">) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (id: string, updatedTask: Partial<Omit<Task, "id">>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
    );
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const completedCount = useMemo(() => tasks.filter((t) => t.completed).length, [tasks]);
  const totalCount = tasks.length;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <Header onAddTask={addTask} />
          <div className="mt-8 space-y-6">
            <ProgressTracker completed={completedCount} total={totalCount} />
            <TaskList
              tasks={tasks}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              onToggleComplete={toggleTaskCompletion}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
