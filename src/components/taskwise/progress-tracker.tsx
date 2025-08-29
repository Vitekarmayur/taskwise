"use client";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProgressTrackerProps {
  completed: number;
  total: number;
}

export function ProgressTracker({ completed, total }: ProgressTrackerProps) {
  const progressPercentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Your Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">
            {completed} of {total} tasks completed
          </p>
          <p className="text-sm font-semibold text-primary">{Math.round(progressPercentage)}%</p>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </CardContent>
    </Card>
  );
}
