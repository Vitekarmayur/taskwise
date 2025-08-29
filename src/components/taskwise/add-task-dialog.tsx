"use client";

import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { Task } from "@/lib/types";
import {
  suggestCategoriesAction,
  suggestScheduleAction,
} from "@/app/actions";
import { Badge } from "../ui/badge";
import { useToast } from "@/hooks/use-toast";

interface AddTaskDialogProps {
  children: ReactNode;
  onAddTask: (task: Omit<Task, "id" | "completed">) => void;
}

export function AddTaskDialog({ children, onAddTask }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [category, setCategory] = useState("");
  const [userHabits, setUserHabits] = useState("I am most productive in the mornings.");

  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
  const [isCatLoading, setIsCatLoading] = useState(false);
  const [isSchedLoading, setIsSchedLoading] = useState(false);
  
  const { toast } = useToast();

  const handleSuggestCategories = async () => {
    if (!description) {
      toast({
        title: "No Description",
        description: "Please enter a task description first.",
        variant: "destructive",
      })
      return;
    }
    setIsCatLoading(true);
    setSuggestedCategories([]);
    const result = await suggestCategoriesAction(description);
    setSuggestedCategories(result.suggestedCategories);
    setIsCatLoading(false);
  };

  const handleSuggestSchedule = async () => {
    if (!description || !userHabits) {
      toast({
        title: "Missing Information",
        description: "Please enter a description and your work habits.",
        variant: "destructive",
      })
      return;
    }
    setIsSchedLoading(true);
    const result = await suggestScheduleAction(description, priority, userHabits);
    if (result && !("error" in result)) {
      const suggestedDate = new Date(result.suggestedSchedule);
      if (!isNaN(suggestedDate.getTime())) {
        setDueDate(suggestedDate);
        toast({
          title: "Schedule Suggested!",
          description: result.reasoning,
        })
      } else {
         toast({
          title: "Could not set date",
          description: `AI suggested: ${result.suggestedSchedule}. Please set manually.`,
          variant: "destructive",
        })
      }
    } else {
       toast({
        title: "Suggestion Failed",
        description: result.error,
        variant: "destructive",
      })
    }
    setIsSchedLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) {
       toast({
        title: "Description is required.",
        variant: "destructive",
      })
      return
    };
    onAddTask({ description, dueDate, priority, category });
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setDescription("");
    setDueDate(null);
    setPriority("medium");
    setCategory("");
    setSuggestedCategories([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Add a New Task</DialogTitle>
          <DialogDescription>
            Fill in the details below. Use our AI assistant for suggestions!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="description">Task Description</Label>
            <Textarea
              id="description"
              placeholder="e.g., Remind me to call mom tomorrow at 5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select onValueChange={setPriority} value={priority}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="due-date">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate ?? undefined}
                    onSelect={(d) => setDueDate(d || null)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-4 p-4 border rounded-lg bg-secondary/50">
            <h4 className="font-semibold text-sm flex items-center gap-2 font-headline">
              <Sparkles className="h-4 w-4 text-primary" /> AI Assistant
            </h4>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <div className="flex gap-2">
                 <Input
                  id="category"
                  placeholder="e.g. Work"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <Button type="button" variant="outline" onClick={handleSuggestCategories} disabled={isCatLoading}>
                  {isCatLoading ? "Thinking..." : "Suggest"}
                </Button>
              </div>
              {suggestedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {suggestedCategories.map(cat => (
                    <Badge key={cat} onClick={() => setCategory(cat)} className="cursor-pointer" variant="outline">{cat}</Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-2">
                <Label htmlFor="user-habits">Scheduling Habits</Label>
                 <Textarea
                  id="user-habits"
                  placeholder="e.g. I work best in the mornings..."
                  value={userHabits}
                  onChange={(e) => setUserHabits(e.target.value)}
                  className="text-sm h-20 bg-background"
                />
                <Button type="button" variant="outline" onClick={handleSuggestSchedule} disabled={isSchedLoading}>
                   {isSchedLoading ? "Optimizing..." : "Suggest Schedule"}
                </Button>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Add Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
